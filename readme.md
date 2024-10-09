## Inspiration
Why isn't Crypto as mainstream as Centralized monetary systems? 
What are some major factors making people avoid using crypto for usual monetary transactions?
- One such factor is the sense of security, One might feel safe with their money when it is locked some where safe, when you are confident that your money is somewhere safe. 
- A monetary system becomes strong and preferred when it could allow you to have that sense of security and still be able to spend your money where ever you want.

-  One such solution banks came up was introduction of plastic money(credit and debit cards which now evolved into online payment systems), and now a person could bee safe about his money in the bank and carry the plastic money anywhere, in case the plastic money i.e. card or your mobile is stolen, one can easily call and disable the card and one will never loose anything other tan a very small  amount. Also now you could have multiple plastic cards which you could share with your family and allow them to spend from your account nd also set limits and restrictions on everything

- With crypto the issue an issue, we always have to carry the account with us, be it a hardware wallet or in mobile. We needed something with crypto such that your highly secure hardware wallet could lie guilt free in a safe and you could carry out smaller transactions without any issue. 

## What our project Delegated Accounts and Cypto Plastic Money does
- Delegated Accounts and Cypto Plastic Money tries to provide similar ability for crypto accounts by providing a delegator contract for main account and allowing multiple delegates i.e. family members to spend from the main account, 
- It also provides full ability to restrict daily limits for amount and number of transactions as well as per transaction limit and time delay between two transaction, also allowing you to monitor who initiated the transactions. 
- Next phase involves involvement of NFC transactions, and we are also working on a new type of NFC card based crypto delegated wallet to allow blockchain nd tron to go mainstream 

## How we built it
We first created a Delegator contract, could be found on our git repo contract's section in TronIDE. and toughly tested out its capabilities. 
- Delegator contract could be deployed by any main account who wants to add delegates.
- Then user would provide allowance to the Delegator contract to spend money on te accounts behalf, this could be restricted based on user's preference, and could add another security layer. 

-Then user could add as many delegates as he wants and provide separate name  and values of  daily limits for amount and number of transactions as well as per transaction limit and time delay between two transaction.

These delegates could be an wallet based account without restrictions

- Then delegates could use our delegates sections to see their limits, and carry out transactions of sending USDT form the section, without requiring to have any available resources

- If a delegate account is compromised or stolen or lost, one can directly login using main account and disable the delegate account, or can contact admin contract to get the delegate disabled.

We also made a Admin Contract to manage addresses of all delegate accounts, and allow disabling delegates without having access to main account in cases you are travelling, etc. 

We also created a frontend for accessing the same using react and tronweb

**please note this is our first step towards creating actual plastic crypto in form of nfc card, We have the finalized the RTL designs for a IC , with NFC capabilities, and could sign wallet transactions on chip, and will be using delegator contracts. The chip is now in Verifications stages and we are reverifying the storage security capabilities for the same. we are in talk with a silicon proven edtech startup "VSD" in India to get our chips taped out, Our team was sponsored for a Complete internship by the startup to understand complete process related to IC design manufacturing, add now we re certified Physical Design Engineer.

First test batch of NFC and onchip transaction signing capable delegated card should be available with us by next phase of Tron Hackathhon

## Challenges we ran into
We wanted to showcase the usefulness of delegated account to the community but were much busy with the Development and Testing of the IC design, and complete frontend for this project was built in only few days to be in mainstream community in this hackathon and participate in builder category in next season, while also making sure that we understand community and make necessary changes to the final expected product.

## Accomplishments that we're proud of
We are proud to be able to demonstrate how delegated accounts work and also to keep all the concepts easy to understand for anyone. 

## What we learned
We learned a lot about multiple technologies, and how we could bring togethers multiple streams to build something great
  
## What's next for Delegated Accounts and Cypto Plastic Money

New Tape out and crypto enabled NFCs with delegated accounts, the first tape out would take approx. 4-5 months, and in the mean time, we would continue to have our software ready for great UI and integrations.

We would surely love to be active with community as much possible nd integrate the community response, 


Tron would be the first chain we would be deploying our delegated crypto plastic cards, as it allows for enery sharing and zero fee transactions, which could be very helpful for the cards