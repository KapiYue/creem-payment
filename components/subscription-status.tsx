"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CrownIcon,
  UserIcon,
  CalendarIcon,
  LoaderIcon,
  XIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from 'lucide-react';
import type { SubscriptionWithOrder } from '@/lib/creem';

function getProductName(subscription: SubscriptionWithOrder): string {
  if (typeof subscription.product === 'string') {
    return subscription.localOrder.productName;
  }
  return subscription.product.name;
}

function getBillingPeriod(subscription: SubscriptionWithOrder): string {
  if (typeof subscription.product === 'string') {
    return '月';
  }
  return subscription.product.billing_period === 'every-month' ? '月' : '年';
}

export function SubscriptionStatus() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmSubscriptionId, setConfirmSubscriptionId] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions');

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setIsSubscribed(data.isSubscribed ?? false);
      setSubscriptions(data.subscriptions ?? []);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCanceling(subscriptionId);

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to cancel subscription');
      }

      setConfirmSubscriptionId(null);
      await fetchSubscriptions();
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCanceling(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '有效';
      case 'canceled':
        return '已取消';
      case 'unpaid':
        return '未付款';
      case 'paused':
        return '暂停';
      case 'trialing':
        return '试用';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${(amount / 100).toFixed(2)}`;
  };


  const confirmSubscription = subscriptions.find(
    (sub) => sub.id === confirmSubscriptionId
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CrownIcon className="w-5 h-5" />
            订阅状态
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoaderIcon className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">加载中...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CrownIcon className="w-5 h-5" />
            订阅状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">加载订阅状态失败: {error}</p>
            <Button onClick={fetchSubscriptions} variant="outline">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isSubscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            用户状态
          </CardTitle>
          <CardDescription>您当前的会员状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <UserIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">普通用户</h3>
            <p className="text-muted-foreground text-sm mb-4">
              您当前没有有效的订阅计划
            </p>
            <Badge variant="outline" className="bg-gray-50">
              免费用户
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CrownIcon className="w-5 h-5 text-yellow-600" />
                订阅会员
              </CardTitle>
              <CardDescription>您的订阅计划详情</CardDescription>
            </div>
            <Button onClick={fetchSubscriptions} variant="outline" size="sm">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CrownIcon className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-medium">{getProductName(subscription)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatAmount(subscription.localOrder.amount, subscription.localOrder.currency ?? 'USD')} /{' '}
                      {getBillingPeriod(subscription)}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(subscription.status)}>
                  {getStatusLabel(subscription.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {subscription.current_period_start_date && (
                  <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">当前周期开始</p>
                      <p className="text-muted-foreground">
                        {formatDateTime(subscription.current_period_start_date)}
                      </p>
                    </div>
                  </div>
                )}

                {subscription.current_period_end_date && (
                  <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">当前周期结束</p>
                      <p className="text-muted-foreground">
                        {formatDateTime(subscription.current_period_end_date)}
                      </p>
                    </div>
                  </div>
                )}

                {subscription.status === 'active' && subscription.next_transaction_date && (
                  <div className="flex items-center gap-2 md:col-span-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>下次扣费: {formatDateTime(subscription.next_transaction_date)}</span>
                  </div>
                )}

                {subscription.canceled_at && (
                  <div className="flex items-center gap-2 md:col-span-2">
                    <XIcon className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">
                      取消时间: {formatDateTime(subscription.canceled_at)}
                    </span>
                  </div>
                )}
              </div>

              {subscription.status === 'active' && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setConfirmSubscriptionId(subscription.id)}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    取消订阅
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={confirmSubscriptionId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmSubscriptionId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-red-500" />
              确认取消订阅
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                {confirmSubscription && (
                  <>
                    <p>
                      您确定要取消 &ldquo;{getProductName(confirmSubscription)}&rdquo; 的订阅吗？
                    </p>
                    <p className="mt-4">取消后：</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>您将失去订阅会员的所有权益</li>
                      <li>
                        可以继续使用到当前计费周期结束
                        {confirmSubscription.current_period_end_date &&
                          `（${formatDateTime(confirmSubscription.current_period_end_date)}）`}
                      </li>
                      <li>不会再产生后续费用</li>
                    </ul>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmSubscriptionId(null)}
              disabled={canceling !== null}
            >
              返回
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmSubscriptionId) {
                  handleCancelSubscription(confirmSubscriptionId);
                }
              }}
              disabled={canceling !== null}
            >
              {canceling ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  取消中...
                </>
              ) : (
                '确认取消订阅'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
