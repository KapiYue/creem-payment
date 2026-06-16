> ## Documentation Index
> Fetch the complete documentation index at: https://docs.creem.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Checkout Link

> Learn how to receive payments without any code

## Prerequisites

To get the most out of this guide, you'll need to:

* **Create an account on Creem.io**
* **Have your API key ready**

## 1. Create a product

Go over to the [products tab](https://creem.io/dashboard/products) and create a product.
You can add a name, description, and price to your product. Optionally you can also add a picture to your product that will be shown to users.

<AccordionGroup>
  <Accordion icon="browser" title="Product page">
    <img style={{ borderRadius: '0.5rem' }} src="https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/add-product-B0Khh16pSFp3DpwsuBrrExvlwovhMq.png" />
  </Accordion>

  <Accordion icon="file-spreadsheet" title="Adding product details">
    <img style={{ borderRadius: '0.5rem' }} src="https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/Screenshot%202024-10-03%20at%2015.51.45-arQ1KogX03W1cGCmTgMBSJFd8d8QYR.png" />
  </Accordion>
</AccordionGroup>

## 2. Copy the payment link from the product

After successfully creating your product, you can copy the payment link by clicking on the product Share button. Simply send this link to your users and they will be able to pay you instantly.

### More use cases

If you are not planning to do a no-code integration, we strongly encourage you to check out our other guides.
Create checkout-sessions and prices dynamically, use webhooks to receive updates on your application automatically, and much more. Check out our guides to get the most out of Creem.

<CardGroup>
  <Card title="Checkout API" icon="code" href="/features/checkout/checkout-api">
    Learn how to create and manage checkout sessions programmatically using the
    Creem API.
  </Card>

  <Card title="Webhooks and Events" icon="square-code" href="/code/webhooks">
    Set up webhooks to receive updates on your application automatically.
  </Card>
</CardGroup>

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.creem.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Creates a new checkout session

> Create a new checkout session to accept one-time payments or start subscriptions. Returns a checkout URL to redirect customers.



## OpenAPI

````yaml post /v1/checkouts
openapi: 3.0.0
info:
  title: Creem API
  description: >-
    Creem is an all-in-one platform for managing subscriptions and recurring
    revenue, tailored specifically for today's SaaS companies. It enables you to
    boost revenue, enhance customer retention, and scale your operations
    seamlessly.
  version: v1
  contact:
    name: Creem Support
    url: https://creem.io
    email: support@creem.io
  license:
    name: Commercial
    url: https://creem.io/terms
  termsOfService: https://creem.io/terms
servers:
  - url: https://api.creem.io
  - url: https://test-api.creem.io
security: []
tags: []
externalDocs:
  description: Creem Documentation
  url: https://docs.creem.io
paths:
  /v1/checkouts:
    post:
      tags:
        - Checkouts
      summary: Creates a new checkout session.
      description: >-
        Create a new checkout session to accept one-time payments or start
        subscriptions. Returns a checkout URL to redirect customers.
      operationId: createCheckout
      parameters: []
      requestBody:
        required: true
        description: Create checkout request payload
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCheckoutRequest'
      responses:
        '200':
          description: Successfully created a checkout session
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CheckoutEntity'
        '400':
          description: Bad Request - Invalid input parameters
        '401':
          description: Unauthorized - Invalid or missing API key
        '404':
          description: Not Found - Resource does not exist
      security:
        - ApiKey: []
components:
  schemas:
    CreateCheckoutRequest:
      type: object
      properties:
        request_id:
          type: string
          description: Identify and track each checkout request.
        product_id:
          type: string
          description: The ID of the product associated with the checkout session.
          example: prod_1234567890
        units:
          type: number
          description: The number of units for the order.
          example: 1
        discount_code:
          type: string
          description: Prefill the checkout session with a discount code.
          example: SUMMER2024
        customer:
          description: >-
            Customer data for checkout session. This will prefill the customer
            info on the checkout page.
          allOf:
            - $ref: '#/components/schemas/CustomerRequestEntity'
        custom_fields:
          description: >-
            Collect additional information from your customer using custom
            fields. Up to 3 fields are supported.
          type: array
          items:
            $ref: '#/components/schemas/CustomFieldRequestEntity'
        custom_field:
          description: >-
            DEPRECATED: Use `custom_fields` instead. Collect additional
            information from your customer using custom fields. Up to 3 fields
            are supported.
          deprecated: true
          type: array
          items:
            $ref: '#/components/schemas/CustomFieldRequestEntity'
        success_url:
          type: string
          description: >-
            The URL to which the user will be redirected after the checkout
            process is completed.
        metadata:
          type: object
          description: Metadata for the checkout in the form of key-value pairs
          example:
            userId: user_123
            visitCount: 42
            lastVisit: '2023-04-01'
          additionalProperties: true
      required:
        - product_id
    CheckoutEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object's type. Objects of the same type
            share the same value.
        status:
          type: string
          description: Status of the checkout.
          enum:
            - pending
            - processing
            - completed
            - expired
          example: completed
        request_id:
          type: string
          description: Identify and track each checkout request.
        product:
          description: The product associated with the checkout session.
          oneOf:
            - type: string
            - $ref: '#/components/schemas/ProductEntity'
        units:
          type: number
          description: The number of units for the of the product.
          default: 1
        order:
          description: The order associated with the checkout session.
          allOf:
            - $ref: '#/components/schemas/OrderEntity'
        subscription:
          description: The subscription associated with the checkout session.
          oneOf:
            - type: string
            - $ref: '#/components/schemas/SubscriptionEntity'
        customer:
          description: The customer associated with the checkout session.
          oneOf:
            - type: string
            - $ref: '#/components/schemas/CustomerEntity'
        custom_fields:
          description: >-
            Additional information collected from your customer during the
            checkout process.
          type: array
          items:
            $ref: '#/components/schemas/CustomField'
        checkout_url:
          type: string
          description: >-
            The URL to which the customer will be redirected to complete the
            payment.
        success_url:
          type: string
          description: >-
            The URL to which the user will be redirected after the checkout
            process is completed.
          example: https://example.com/return
          nullable: true
        feature:
          description: Features issued for the order.
          type: array
          items:
            $ref: '#/components/schemas/ProductFeatureEntity'
        metadata:
          type: object
          description: Metadata for the checkout in the form of key-value pairs
          example:
            userId: user_123
            visitCount: 42
            lastVisit: '2023-04-01'
          additionalProperties: true
      required:
        - id
        - mode
        - object
        - status
        - product
    CustomerRequestEntity:
      type: object
      properties:
        id:
          type: string
          description: >-
            Unique identifier of the customer. You may specify only one of these
            parameters: id or email.
          example: cust_1234567890
        email:
          type: string
          description: >-
            Customer email address. You may only specify one of these
            parameters: id, email.
          example: user@example.com
    CustomFieldRequestEntity:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/CustomFieldRequestType'
          example: text
        key:
          type: string
          description: >-
            Unique key for custom field. Must be unique to this field,
            alphanumeric, and up to 200 characters.
          example: companyName
          maxLength: 200
        label:
          type: string
          description: >-
            The label for the field, displayed to the customer, up to 50
            characters.
          example: Company Name
          maxLength: 50
        optional:
          type: boolean
          description: >-
            Whether the customer is required to complete the field. Defaults to
            `false`
        text:
          description: Configuration for text field type.
          allOf:
            - $ref: '#/components/schemas/TextFieldConfig'
        checkbox:
          description: Configuration for checkbox field type.
          allOf:
            - $ref: '#/components/schemas/CheckboxFieldConfig'
      required:
        - type
        - key
        - label
    EnvironmentMode:
      type: string
      description: String representing the environment.
      enum:
        - test
        - prod
        - sandbox
    ProductEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object's type. Objects of the same type
            share the same value.
        name:
          type: string
          description: The name of the product
        description:
          type: string
          description: A brief description of the product
          example: This is a sample product description.
        image_url:
          type: string
          description: URL of the product image. Only png as jpg are supported
          example: https://example.com/image.jpg
        features:
          description: Features of the product.
          type: array
          items:
            $ref: '#/components/schemas/FeatureEntity'
        price:
          type: number
          description: The price of the product in cents. 1000 = $10.00
          example: 400
        currency:
          type: string
          description: >-
            Three-letter ISO currency code, in uppercase. Must be a supported
            currency.
          example: USD
        billing_type:
          type: string
          description: >-
            Indicates the billing method for the customer. It can either be a
            `recurring` billing cycle or a `onetime` payment.
          example: recurring
        billing_period:
          type: string
          description: Billing period
          example: every-month
        status:
          type: string
          description: Status of the product
        tax_mode:
          type: string
          description: >-
            Specifies the tax calculation mode for the transaction. If set to
            "inclusive," the tax is included in the price. If set to
            "exclusive," the tax is added on top of the price.
          example: inclusive
        tax_category:
          type: string
          description: >-
            Categorizes the type of product or service for tax purposes. This
            helps determine the applicable tax rules based on the nature of the
            item or service.
          example:
            - saas
            - digital-goods-service
            - ebooks
        product_url:
          type: string
          description: >-
            The product page you can redirect your customers to for express
            checkout.
          example: https://creem.io/product/prod_123123123123
        default_success_url:
          type: string
          description: >-
            The URL to which the user will be redirected after successfull
            payment.
          example: https://example.com/?status=successful
          nullable: true
        created_at:
          format: date-time
          type: string
          description: Creation date of the product
          example: '2023-01-01T00:00:00Z'
        updated_at:
          format: date-time
          type: string
          description: Last updated date of the product
          example: '2023-01-01T00:00:00Z'
      required:
        - id
        - mode
        - object
        - name
        - description
        - price
        - currency
        - billing_type
        - billing_period
        - status
        - tax_mode
        - tax_category
        - created_at
        - updated_at
    OrderEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object's type. Objects of the same type
            share the same value.
        customer:
          type: string
          description: The customer who placed the order.
        product:
          type: string
          description: The product associated with the order.
        transaction:
          type: string
          description: The transaction ID of the order
          example: tx_1234567890
        discount:
          type: string
          description: The discount ID of the order
          example: dis_1234567890
        amount:
          type: number
          description: The total amount of the order in cents. 1000 = $10.00
          example: 2000
        sub_total:
          type: number
          description: The subtotal of the order in cents. 1000 = $10.00
          example: 1800
        tax_amount:
          type: number
          description: The tax amount of the order in cents. 1000 = $10.00
          example: 200
        discount_amount:
          type: number
          description: The discount amount of the order in cents. 1000 = $10.00
          example: 100
        amount_due:
          type: number
          description: The amount due for the order in cents. 1000 = $10.00
          example: 1900
        amount_paid:
          type: number
          description: The amount paid for the order in cents. 1000 = $10.00
          example: 1900
        currency:
          type: string
          description: >-
            Three-letter ISO currency code, in uppercase. Must be a supported
            currency.
          example: USD
        fx_amount:
          type: number
          description: The amount in the foreign currency, if applicable.
          example: 15
        fx_currency:
          type: string
          description: Three-letter ISO code of the foreign currency, if applicable.
          example: EUR
        fx_rate:
          type: number
          description: >-
            The exchange rate used for converting between currencies, if
            applicable.
          example: 1.2
        status:
          type: string
          description: Current status of the order.
          enum:
            - pending
            - paid
          example: pending
        type:
          type: string
          description: >-
            The type of order. This can specify whether it's a regular purchase,
            subscription, etc.
          example: recurring
          enum:
            - recurring
            - onetime
        affiliate:
          type: string
          description: The affiliate associated with the order, if applicable.
        created_at:
          format: date-time
          type: string
          description: Creation date of the order
          example: '2023-09-13T00:00:00Z'
        updated_at:
          format: date-time
          type: string
          description: Last updated date of the order
          example: '2023-09-13T00:00:00Z'
      required:
        - id
        - mode
        - object
        - product
        - amount
        - currency
        - status
        - type
        - created_at
        - updated_at
    SubscriptionEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object's type. Objects of the same type
            share the same value.
          example: subscription
        product:
          description: The product associated with the subscription.
          oneOf:
            - $ref: '#/components/schemas/ProductEntity'
            - type: string
        customer:
          description: The customer who owns the subscription.
          oneOf:
            - $ref: '#/components/schemas/CustomerEntity'
            - type: string
        items:
          description: Subscription items.
          type: array
          items:
            $ref: '#/components/schemas/SubscriptionItemEntity'
        collection_method:
          type: string
          description: The method used for collecting payments for the subscription.
          example: charge_automatically
        status:
          type: string
          description: The current status of the subscription.
          enum:
            - active
            - canceled
            - unpaid
            - paused
            - trialing
            - scheduled_cancel
          example: active
        last_transaction_id:
          type: string
          description: The ID of the last paid transaction.
          example: tran_3e6Z6TzvHKdsjEgXnGDEp0
        last_transaction:
          description: The last paid transaction.
          allOf:
            - $ref: '#/components/schemas/TransactionEntity'
        last_transaction_date:
          format: date-time
          type: string
          description: The date of the last paid transaction.
          example: '2024-09-12T12:34:56Z'
        next_transaction_date:
          format: date-time
          type: string
          description: The date when the next subscription transaction will be charged.
          example: '2024-09-12T12:34:56Z'
        current_period_start_date:
          format: date-time
          type: string
          description: The start date of the current subscription period.
          example: '2024-09-12T12:34:56Z'
        current_period_end_date:
          format: date-time
          type: string
          description: The end date of the current subscription period.
          example: '2024-09-12T12:34:56Z'
        canceled_at:
          type: string
          description: The date and time when the subscription was canceled, if applicable.
          example: '2024-09-12T12:34:56Z'
          format: date-time
          nullable: true
        created_at:
          format: date-time
          type: string
          description: The date and time when the subscription was created.
          example: '2024-01-01T00:00:00Z'
        updated_at:
          type: string
          description: The date and time when the subscription was last updated.
          example: '2024-09-12T12:34:56Z'
          format: date-time
        discount:
          type: object
          description: The discount code applied to the subscription, if any.
      required:
        - id
        - mode
        - object
        - product
        - customer
        - collection_method
        - status
        - created_at
        - updated_at
    CustomerEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object’s type. Objects of the same type
            share the same value.
        email:
          type: string
          description: Customer email address.
          example: user@example.com
        name:
          type: string
          description: Customer name.
          example: John Doe
        country:
          type: string
          description: The ISO alpha-2 country code for the customer.
          example: US
          pattern: ^[A-Z]{2}$
        created_at:
          format: date-time
          type: string
          description: Creation date of the product
          example: '2023-01-01T00:00:00Z'
        updated_at:
          format: date-time
          type: string
          description: Last updated date of the product
          example: '2023-01-01T00:00:00Z'
      required:
        - id
        - mode
        - object
        - email
        - country
        - created_at
        - updated_at
    CustomField:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/CustomFieldType'
        key:
          type: string
          description: >-
            Unique key for custom field. Must be unique to this field,
            alphanumeric, and up to 200 characters.
          maxLength: 200
        label:
          type: string
          description: >-
            The label for the field, displayed to the customer, up to 50
            characters
          maxLength: 200
        optional:
          type: boolean
          description: >-
            Whether the customer is required to complete the field. Defaults to
            `false`.
        text:
          description: Configuration for text field type.
          allOf:
            - $ref: '#/components/schemas/Text'
        checkbox:
          description: Configuration for checkbox field type.
          allOf:
            - $ref: '#/components/schemas/Checkbox'
      required:
        - type
        - key
        - label
    ProductFeatureEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the feature.
          example: feat_abc123
        description:
          type: string
          description: A brief description of the feature.
          example: Get access to the full course materials.
        type:
          $ref: '#/components/schemas/ProductFeatureType'
          example: licenseKey
        private_note:
          type: string
          description: >-
            Private note from the seller. This is only visible to the customer
            after purchase.
          example: 'Thank you for your purchase! Here is your access code: XYZ123'
        file:
          description: File feature data containing downloadable files.
          allOf:
            - $ref: '#/components/schemas/FileFeatureEntity'
        license_key:
          description: License key issued for the order.
          allOf:
            - $ref: '#/components/schemas/LicenseEntity'
        license:
          description: >-
            DEPRECATED: Use `license_key` instead. License key issued for the
            order.
          deprecated: true
          allOf:
            - $ref: '#/components/schemas/LicenseEntity'
    CustomFieldRequestType:
      type: string
      description: The type of the field.
      enum:
        - text
        - checkbox
    TextFieldConfig:
      type: object
      properties:
        max_length:
          type: number
          description: Maximum character length constraint for the input.
          example: 200
        min_length:
          type: number
          description: Minimum character length requirement for the input.
          example: 1
    CheckboxFieldConfig:
      type: object
      properties:
        label:
          type: string
          description: The markdown text to display for the checkbox.
          example: I agree to the [terms and conditions](https://example.com/terms)
    FeatureEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the feature.
          example: feat_abc123
        type:
          $ref: '#/components/schemas/ProductFeatureType'
          example: licenseKey
        description:
          type: string
          description: A brief description of the feature.
          example: Access to premium course materials.
      required:
        - id
        - type
        - description
    SubscriptionItemEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object’s type. Objects of the same type
            share the same value.
        product_id:
          type: string
          description: The ID of the product associated with the subscription item.
        price_id:
          type: string
          description: The ID of the price associated with the subscription item.
        units:
          type: number
          description: The number of units for the subscription item.
      required:
        - id
        - mode
        - object
    TransactionEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            String representing the object's type. Objects of the same type
            share the same value.
          example: transaction
        amount:
          type: number
          description: The transaction amount in cents. 1000 = $10.00
          example: 2000
        amount_paid:
          type: number
          description: The amount the customer paid in cents. 1000 = $10.00
          example: 2000
        discount_amount:
          type: number
          description: The discount amount in cents. 1000 = $10.00
          example: 2000
        currency:
          type: string
          description: >-
            Three-letter ISO currency code, in uppercase. Must be a supported
            currency.
          example: USD
        type:
          type: string
          description: >-
            The type of transaction. payment(one time payments) and
            invoice(subscription)
        tax_country:
          type: string
          description: The ISO alpha-2 country code where tax is collected.
          example: US
          pattern: ^[A-Z]{2}$
        tax_amount:
          type: number
          description: The sale tax amount in cents. 1000 = $10.00
          example: 2000
        status:
          type: string
          description: Status of the transaction.
        refunded_amount:
          type: number
          description: The amount that has been refunded in cents. 1000 = $10.00
          example: 2000
          nullable: true
        order:
          type: string
          description: The order associated with the transaction.
          nullable: true
        subscription:
          type: string
          description: The subscription associated with the transaction.
          nullable: true
        customer:
          type: string
          description: The customer associated with the transaction.
          nullable: true
        description:
          type: string
          description: The description of the transaction.
        period_start:
          type: number
          description: Start period for the invoice as timestamp
        period_end:
          type: number
          description: End period for the invoice as timestamp
        created_at:
          type: number
          description: Creation date of the order as timestamp
      required:
        - id
        - mode
        - object
        - amount
        - currency
        - type
        - status
        - created_at
    CustomFieldType:
      type: string
      description: The type of the field.
      enum:
        - text
        - checkbox
    Text:
      type: object
      properties:
        max_length:
          type: number
          description: Maximum character length constraint for the input.
        minimum_length:
          type: number
          description: Minimum character length requirement for the input.
        value:
          type: string
          description: The value of the input.
    Checkbox:
      type: object
      properties:
        label:
          type: string
          description: The markdown text to display for the checkbox.
        value:
          type: boolean
          description: The value of the checkbox (checked or not).
    ProductFeatureType:
      type: string
      description: >-
        The type of the feature: privateNote (custom note), file (downloadable
        files), or licenseKey (license key).
      enum:
        - custom
        - file
        - licenseKey
    FileFeatureEntity:
      type: object
      properties:
        files:
          description: List of downloadable files.
          type: array
          items:
            $ref: '#/components/schemas/FeatureFileEntity'
      required:
        - files
    LicenseEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            A string representing the object’s type. Objects of the same type
            share the same value.
        status:
          type: string
          description: The current status of the license key.
          enum:
            - inactive
            - active
            - expired
            - disabled
          example: active
        key:
          type: string
          description: The license key.
          example: ABC123-XYZ456-XYZ456-XYZ456
        activation:
          type: number
          description: The number of instances that this license key was activated.
          example: 5
        activation_limit:
          type: object
          description: The activation limit. Null if activations are unlimited.
          example: 1
          nullable: true
        expires_at:
          type: object
          description: >-
            The date the license key expires. Null if it does not have an
            expiration date.
          example: '2023-09-13T00:00:00Z'
          nullable: true
        created_at:
          format: date-time
          type: string
          description: The creation date of the license key.
          example: '2023-09-13T00:00:00Z'
        instance:
          description: Associated license instances.
          nullable: true
          allOf:
            - $ref: '#/components/schemas/LicenseInstanceEntity'
      required:
        - id
        - mode
        - object
        - status
        - key
        - activation
        - created_at
    FeatureFileEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the file.
          example: file_abc123
        file_name:
          type: string
          description: The name of the file.
          example: ebook.pdf
        url:
          type: string
          description: The URL to download the file.
          example: https://storage.creem.io/files/ebook.pdf
        type:
          type: string
          description: The MIME type of the file.
          example: application/pdf
        size:
          type: number
          description: The size of the file in bytes.
          example: 1024000
      required:
        - id
        - file_name
        - url
        - type
        - size
    LicenseInstanceEntity:
      type: object
      properties:
        id:
          type: string
          description: Unique identifier for the object.
        mode:
          $ref: '#/components/schemas/EnvironmentMode'
        object:
          type: string
          description: >-
            A string representing the object’s type. Objects of the same type
            share the same value.
          example: license-instance
        name:
          type: string
          description: The name of the license instance.
          example: My Customer License Instance
        status:
          type: string
          description: The status of the license instance.
          enum:
            - active
            - deactivated
          example: active
        created_at:
          format: date-time
          type: string
          description: The creation date of the license instance.
          example: '2023-09-13T00:00:00Z'
      required:
        - id
        - mode
        - object
        - name
        - status
        - created_at
  securitySchemes:
    ApiKey:
      type: apiKey
      in: header
      name: x-api-key
      description: >-
        API key for authentication. You can find your API key in the Creem
        dashboard under Settings > API Keys.

````