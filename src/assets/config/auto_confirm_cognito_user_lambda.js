exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
  const modifiedEvent = event
  
  // check that we're acting on the right trigger
  if (event.triggerSource.startsWith("PreSignUp")) {
    
    // auto confirm the user
    modifiedEvent.response.autoConfirmUser = true
    
    if (event.request.userAttributes.hasOwnProperty("email")) {
        modifiedEvent.response.autoVerifyEmail = true;
    }

    // Set the phone number as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty("phone_number")) {
        modifiedEvent.response.autoVerifyPhone = true;
    }
    
    callback(null, modifiedEvent)
    return
  }
  
  // Throw an error if invoked from the wrong trigger
  callback(`Misconfigured Cognito Trigger ${ event.triggerSource }`)
};
