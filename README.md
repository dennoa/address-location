# sharecover-v2-api
API operations to support ShareCover.

* public operations require no authentication.
* secure operations require prior authentication. The Authorization header must contain an appropriate JWT or basic authentication credentials.
* admin operations require prior authentication by an administrator. The Authorization header must contain an appropriate JWT.
* authentication operations provide the mechanisms to authenticate and create an appropriate JWT.

The swagger documentation can be accessed via GET /swagger.
You can browse it with a swagger client such as this one on AWS S3: http://edge-swagger-ui.s3-website-ap-southeast-2.amazonaws.com/?url=http://api-test.sharecover.com/swagger

## Notes on the model

### Distributors and white labelling
ShareCover can be used by third party distributors as if it were their own system. This requires separation of data as if each distributor had their own database.

1. Each distributor has a unique namespace that corresponds to the sub-domain we set them up with.
2. Some public api operations allow <code>distributorNamespace</code> to optionally be specified. This identifies the distributor to associate with the data or functionality in question.
3. The stored data references the distributor _id rather than the namespace as that allows us to change a distributor namespace whilst maintaining data integrity.
4. If an entity has a distributorId equal to null, then this indicates a core ShareCover entity not associated with any particular distributor.
5. The same username can be used across different distributors.

Affected api operations include:

1. Authentication. All of the authentication operations allow for distributorNamespace be specified. If specified, processing will reference the corresponding distributor. If not specified, processing assumes a null distributor. The same username can be re-used across different distributors (including the null distributor). If a single customer has dealings with multiple distributors, there will be multiple corresponding user records.
2. Recording a braintree payment method. When this operation is used by an unauthenticated customer (the most common case), the distributorNamespace is used in conjunction with the username and password to either identify an existing customer or to create a new customer.
3. Registering a new user and resetting a user password both allow for distributorNamespace be specified.
4. Calculate price allows for distributorNamespace be specified. A distributor can have their own pricing configuration that overrides the default settings (null distributor). The calculation will fallback to the default if no distributor-specific pricing configuration is found.

### Support for product versioning
There is a product model that supports versioning. Each policy references a particular product instance. The product identifies the PDS and KFS documents along with any other version-specific information.

### Currently no support for other countries
Other countries will likely have different requirements with regards calculation of applicable taxes and required fields on a tax invoice or COI.

* The current model for taxes is specific to Australia.
* The current tax invoice document is specific to Australia.
* The current pricing configuration data for postcodes is specific to Australia.

### Bundles, Quotes and Policies
Much of the detail for bundles, quotes and policies is common and there are shared models and logic reflecting this. An intended use of bundles and quotes is that they can be used as the basis for creating a policy so it makes sense that they hold much of the same data.

#### Host Properties
Bundles, quotes and policies all reference a host property via hostPropertyId. The same host property can be referenced by many different policies, quotes and/or bundles. Most API operations involving policies, quotes and bundles use only the hostPropertyId, however when searching for policies via the <code>POST /secure/policy/find</code> operation an additional hostProperty field is included that holds the expanded host property details.

### Quote Expiry
Quotes are deleted after 7 days. This is achieved by using the mongo cleanup process which utilises an index on the quote created date.
The config contains the number of seconds to retain quote documents (quote.expiresAfter). Mongoose uses this when it first creates the index.
Once the index is created it will not be automatically updated when the config changes, so it must be dropped prior to deployment of such a config change.

    db.quotes.getIndexes() // Find the name of the index on the created date.
    db.quotes.dropIndex('created_1') // Drop the index

### Day Account
Users can be eligible to receive free days of cover via a couple of different mechanisms. In all cases, their free days are managed via their day account that keeps track of their credit and debit transactions. Each transaction has a confirmation date. Credits become available once the confirmation date has been reached. Transactions can be cancelled at any time.

### Rewards
Rewards are a way for users to gain day account credits. There are referral rewards and loyalty rewards.

#### Referrals
Users are rewarded for referring others. Both the referrer and the referred users receive a number of days credit upon policy purchase - the exact number of days is defined by the selected insurance-option. The credits are confirmed once the policy reaches a certain stage (e.g. for a single stay this is after the effectiveFromDate and for a 12 month this is after the 21 day cooling-off period). Prior to that, cancellation of the policy will cancel the associated credits.

#### Loyalty Rewards
Users are rewarded for loyalty. For example, they might receive one free day for every ten days of cover they purchase under single stay policies. The loyalty factor is defined by the selected insurance-option. It is multiplied against the number of days covered by the policy to determine how much that policy contributes to the free cover reward. For example, a loyalty factor of 0.1 means that every 10 days of policy coverage brings 1 day of reward.

The confirmation date for a loyalty credit is calculated as the latest confirmation date of all the policies contributing to that credit. If any of the policies contributing to the credit is cancelled, then the credit is also cancelled. The other contributing policies can then be reassigned to some other credit.

It is possible for a single policy to contribute to more than one credit. For example, if a 15 day policy equates to 1.5 reward days, then one day can be credited from that policy alone, but the remaining 0.5 day must be combined with some other policies in order to make up another full day. The second day cannot be credited until the other policies exist, which means the 15 day policy now contributes to two different credits.

Credits are associated with one or more policies. If any of the policies is cancelled, the credit is cancelled and the other policies are made available for reassignment. If any of the other policies is involved in other credits, then those credits are also cancelled and the policies associated with those are also made available for reassignment. This means a policy cancellation may result in a number of credit transaction changes to arrive at the new balance.

## Folder structure

### /server/api
The api operations. Responsble for:

* Routing api requests
* Validating request content
* Securing access
* Swagger docs

### /server/commons
Common modules that can be used by api operations, components or services.

### /server/components
Models and processing logic to support the api. Responsible for:

* Defining the mongoose schema
* Managing data updates and retrievals
* The "business rules", e.g. price calculation logic

### /server/services
Access to external services such as email or braintree payments. Responsible for:

* Connecting to the service
* Translating between sharecover data models and external data models
