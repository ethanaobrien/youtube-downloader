var videoID = 'oURjAOHF9HY'
var body = '{"context":{"client":{"hl":"en","gl":"US","deviceMake":"","deviceModel":"","clientName":"WEB","clientVersion":"2.20210903.05.01","osName":"Windows","osVersion":"10.0","originalUrl":"https://www.youtube.com/","platform":"DESKTOP","clientFormFactor":"UNKNOWN_FORM_FACTOR","mainAppWebInfo":{"graftUrl":"https://www.youtube.com/playlist?list=PLQErzTgKx_V2mh8OaJl73e9MoVAY2dEH8","webDisplayMode":"WEB_DISPLAY_MODE_BROWSER","isWebNativeShareAvailable":true}},"user":{"lockedSafetyMode":false},"request":{"useSsl":true,"internalExperimentFlags":[],"consistencyTokenJars":[]},"clickTracking":{"clickTrackingParams":"CDgQ7zsYACITCJ-X8M2Y7fICFQ6DwgEdx7kCJw=="}},"continuation":"4qmFsgJhEiRWTFBMUUVyelRnS3hfVjJtaDhPYUpsNzNlOU1vVkFZMmRFSDgaFENBRjZCbEJVT2tOSFZRJTNEJTNEmgIiUExRRXJ6VGdLeF9WMm1oOE9hSmw3M2U5TW9WQVkyZEVIOA%3D%3D"}'
fetch('https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8', {method: "POST", body: body}).then(response => response.text()).then(function(e) {
    console.log(JSON.parse(e))
    
})
