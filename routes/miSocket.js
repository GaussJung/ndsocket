'use strict';
 
var express = require('express');

var router 	= express.Router();

var Hashtable = require('jshashtable');

// F30 ================  웹소켓  ========================= 
// 호출주소 
// 일반접속  :  ws://serverip:1001/socket
// 보안접속  :  wss://serverip:1001/socket
 
const WebSocket = require('ws');    // 소켙라이브러리 호출 

var allmcnt   = 0;                  // 전체 메시지 수량 
var conncnt   = 0;                  // 소켙 접속 횟수 (전체)
var socketPort = 1001; 
var wshashtable = new Hashtable();  // 웹소켙 객체추가 

// global.wshashtable = wshashtable;

const webSkt = new WebSocket.Server({
  port: socketPort,
});
 

// F30. socket Error  
const sendError = (wskt, errmessage) => {

  const messageObject = {
     type: 'ERROR',
     payload: errmessage,
  };

  let outMsg = JSON.stringify(messageObject); 

  console.log("SC100 Error outMsg=" + outMsg); 

  // Send Error Msg 
  wskt.send(JSON.stringify(messageObject));

};
// EOF F30. 


// F29. 디바이스 분리 ws://121.11.23.3/socket?deviceid=10004&user=james --> 10004
function getDeviceId(srcURL) {

    let tmpStr = ""; 
    console.log("P10 URL=" + srcURL);
    // aaa.replace(/(.+)\.html/,"\\$1");
    
    // 인자값이 있을 경우 진행함. 
    if (srcURL.indexOf("?") === -1 ) {
         return ""; 
    }
    else {
        // deviceid인자확인 
        tmpStr = srcURL.replace(/.+deviceid=([^&]+).*/,"$1"); 
        console.log("P20 deviceid=" + tmpStr);
    }; 
}; 


// F31-a. 웹소켙접속 메시지 (전달)
webSkt.on('connection', (wskt, request) => {
      
    // console.log(`C09. Conn Url ${request.url}`);
    let conuri =  request.url; 

    let deviceid = conuri.replace(/.+deviceid=([^&]+).*/,"$1");

    console.log( "SC10 conuri=" + conuri + " / deviceid=" + deviceid); 

    let pfnow     = 0.0;        // 현재 시간 millisec 

    let curmcnt   = 0.0;        // 현재메시지 수량 
   
    conncnt++;                  // 현재 접속 수량증대 

    wskt.send('Connected To mi WebSocket V1.4 conncnt=' + conncnt);

     // F33-1. binding message 
     wskt.on('message', (indata) => {

        let fmessage  = "";

        // 현재시간 ( millisec )
        pfnow = process.hrtime(); 
        curmcnt++;  // 현재메시지 수량 
        allmcnt++;  // 전체 메시지 접속수량 증대 
    
        console.log( "SC90 indata=" + JSON.stringify(indata) ); 
        // SF05. Parse Message 
        try {
            // fmessage = JSON.parse(indata);
            fmessage = indata; 
            //console.log( "SC91 success fmessage=" + indata ); 
        } 
        catch (err) {
            sendError(wskt, 'Wrong format Err SE-150 err=' + err);
            return;
        }
        // EOF SF05. 
        let metaStr = "V1.4 Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
        
        let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
    
        console.log( "SC92 finalMsg=" + finalMsg ); 

        wskt.send(finalMsg); 
    
  });
  // EOF F33-1. message binding 
 
});
// EOF F31-a 
 
module.exports = router;

