var soap = require("soap");
var sha1 = require("sha1");

EbizCharge = function() {

};

/* process variable  */

//var sandbox = true;
process.ebizcharge.sandbox =process.ebizcharge.sandbox?true!false;
process.ebizcharge.sourcekey = process.ebizcharge.sandbox?process.ebizcharge.sandbox!"sdlskdlsdklsdklsdlsd";
process.ebizcharge.pin = process.ebizcharge.pin?process.ebizcharge.pin!"ksjdksdsd";
process.ebizcharge.clientIp = process.ebizcharge.clientIp?process.ebizcharge.clientIp!"192.168.1.1";

EbizCharge.prototype.addCustomerToEbiz = function(userData,cb) {
            var bill = {};


            bill['FirstName'] = userData.fullName;
            bill['LastName'] = '';
            bill['Company'] = userData.companyName;
            bill['Street'] = userData.street;
            bill['Street2'] = '';
            bill['City'] = userData.city;
            bill['State'] = userData.state;
            bill['Zip'] = userData.pincode;
            bill['Country'] = userData.country;
            bill['Email'] = userData.email;
            bill['Phone'] = '';
            bill['Fax'] = '';
            var PaymentMethods = {};

            var cardNumber = [];

            PaymentMethods = {
                cardNumber: cardNumber
            };

            var startDate = new Date();
            var endDateMoment = moment(startDate); // moment(...) can also be used to parse dates in string format
            var CustomerData = {};
            CustomerData['BillingAddress'] = bill;
            CustomerData['PaymentMethods'] = PaymentMethods;
            CustomerData['CustomData'] = [].toString('base64'),
                CustomerData['CustomFields'] = [],
                CustomerData['CustomerID'] = userData.userId,
                CustomerData['Description'] = 'Monthly Bill',
                CustomerData['Enabled'] = false,
                CustomerData['Amount'] = '',
                CustomerData['Tax'] = '0',

                CustomerData['Next'] = endDateMoment.add(1, 'months').format('YYYY-MM-DD'),
                CustomerData['Notes'] = 'addCustomer detail for user',
                CustomerData['NumLeft'] = '50',
                CustomerData['OrderID'] = Math.random(),
                CustomerData['ReceiptNote'] = 'addCustomer  Created Charge.',
                CustomerData['Schedule'] = 'monthly',
                CustomerData['SendReceipt'] = true,
                CustomerData['Source'] = userData.recusive, //'Recurring'
                CustomerData['User'] = '',
                CustomerData['CustNum'] = 'C' + userData.userId
            console.log("customerData", CustomerData);



            // use https://sandbox.ebizcharge.com/soap/gate/DC7B2762/ebizcharge.wsdl also


            var url = _getWsdlUrl();




            var token = getToken();
            soap.createClient(url, function(err, client) {
                console.log("client", token, client.addCustomer);
                var args = {
                    "Token": token,
                    "CustomerData": CustomerData
                };

                console.log("args  ", args);
                client.addCustomer(args, function(err, result, raw, soapHeader) {
                    console.log("result", result, result.addCustomerReturn.$value);

                    var CustNum = result.addCustomerReturn.$value;
                    cb(err, result, raw, soapHeader);


                });

            });



}


function _getWsdlUrl() {
    return process.ebizcharge.sandbox ?
        'https://sandbox.ebizcharge.com/soap/gate/DC7B2762/ebizcharge.wsdl' :
        'https://secure.ebizcharge.com/soap/gate/DC7B2762/ebizcharge.wsdl';
}

function getToken() {
    // Creating a ueSecurityToken
    var sourcekey = process.ebizcharge.sourcekey;
    //Input your merchant console generated source key
    var pin = process.ebizcharge.pin; //Input the PIN set in the source editor for your source key
    // generate random seed value
    var d = new Date();
    var n = d.getTime();
    var seed = n + Math.random();
    // make hash value using sha1 function
    var clear = sourcekey + seed + pin;
    console.log("$clear  ", clear);
    var hash = sha1(clear);
    // assembly ueSecurityToken as an array
    // (php5 will correct the type for us)
    var tok = {};
    tok['SourceKey'] = sourcekey;
    var PinHash = {};
    PinHash['Type'] = 'sha1';
    PinHash['Seed'] = seed;
    PinHash['HashValue'] = hash;
    tok['PinHash'] = PinHash;
    tok['ClientIP'] =process.ebizcharge.clientIp;
    // 'SourceKey':$sourcekey,
    // 'PinHash':array(
    //    'Type':'sha1',
    //    'Seed':$seed,
    //    'HashValue':$hash
    //    ),
    // 'ClientIP':'192.168.0.1'

    return tok;
}

EbizCharge.prototype.addedPaymentMethord = function(userData, callback) {
    var url = _getWsdlUrl();

    console.log("data", userData)



    soap.createClient(url, function(err, client) {

                var PaymentMethod = {
                    'MethodName': 'initial Payment',
                    'CardNumber': userData.cardNumber,
                    'CardExpiration': userData.cardexpire,
                    'CardType': '',
                    'CardCode': '',
                    'AvsStreet': '',
                    'AvsZip': '',
                    'SecondarySort': 0
                };
                var token = getToken();
                var Default = true;
                var Verify = false;
                var args = {
                    "Token": token,
                    "CustNum": data.CustNum,
                    "PaymentMethod": PaymentMethod,
                    "MakeDefault": Default,
                    "Verify": Verify
                };

                client.addCustomerPaymentMethod(args, function(err, result, raw, soapHeader) {
                })





    })

}

EbizCharge.prototype.doInitalPayment = function(userdata, callback) {

  //console.log("result", result.addCustomerPaymentMethodReturn,result.addCustomerPaymentMethodReturn['$value']);
  //
    soap.createClient(url, function(err, client) {
//      { addCustomerPaymentMethodReturn: { attributes: { 'xsi:type': 'xsd:integer' }, '$value': 237 } }
    var paymentMethodId =userdata.payMethordId; // value return by add payment methord
    // result.addCustomerPaymentMethodReturn['$value']
  var Parameters = {
      'Command': 'Sale',
      'Details': {
          'Invoice': userdata.invoice,
          'PONum': '',
          'OrderID': userdata.orderId,
          'Description': 'Sample initial payment.',
          'Amount':userdata.amount
      }
  };

  var PayMethod = '0';
  var args = {};
  args.Token = token;
  args.PaymentMethodID = PayMethod;
  args.CustNum = data.CustNum;
  args.Parameters = Parameters;
  client.runCustomerTransaction(args, function(err, result, raw, soapHeader) {
    callback(err,result);


});

});

}


EbizCharge.prototype.updatePaymentMethod = function(userData, callback) {
    var url = _getWsdlUrl();

  soap.createClient(url, function(err, client) {
                    var PaymentMethod = {
                      'MethodID' : userData.paymentMethodId,
                        'MethodName': 'Payment',
                        'CardNumber': userData.cardNumber,
                        'CardExpiration': userData.cvv,
                        'CardType': '',
                        'CardCode': '',
                        'AvsStreet': '',
                        'AvsZip': '',
                        'SecondarySort': 0
                    };
                    var token = getToken();
                    var Default = true;
                    var Verify = false;
                    var args = {
                        "Token": token,
                      //  "CustNum": data.CustNum,
                        "PaymentMethod": PaymentMethod,
                        "MakeDefault": Default
                    //    "Verify": Verify
                    };

                    client.updateCustomerPaymentMethod(args, function(err, result, raw, soapHeader) {

                      callback(err,result);

                    });
              });




}


module.exports = function(app) {
    return new EbizCharge(app);

};
