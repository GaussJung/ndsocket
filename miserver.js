'use strict'; 

const express   = require('express');
 
const app   = express();
const PORT = process.env.PORT = 3000;
 
// 인원목록 출력 
var memberRouter  = require('./routes/member');    // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');    // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');

// 데이터셑 
 /*
var gEmpFlagSet = require('./dataset/dataEmgSet');   // 비상호출 목록 

var gEmpArr = [];     // 출동대기 직원목록 
var gEmpOutStr = "";  // 출동대기 직원목록 문자열화 ( with join )

global.gEmpFlagSet  = gEmpFlagSet;        // 직원목록 데이터셑 호출 객체 
global.gEmpArr      = gEmpArr;            // 출동대기 직원목록 프로젝트 전역변수 선언 
global.gEmpOutStr   = gEmpOutStr;         // 출동대기 직원목록 문자열 프로젝트 전역변수 선언 
 */ 
// 소켙 
var socketRouter  = require('./routes/misocket');    // 소켙통신 

// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 

// 인원목록 라우팅 
app.use('/member', memberRouter);

// 비상호출 라우팅 
app.use('/emergency', emgRouter);                    

// 목록호출 테스트 
app.use('/emp', empSetRouter);   

// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));
 
 // 소켙 통신  
app.use('/misocket', socketRouter);                


// 상태목록 호출 라이브러리  (경로명에 유의)
var deviceStatusSet = require('./dataset/dataDeviceSet');   
// var gEmpList = [];

// global.gEmpFlagSet  = gEmpFlagSet;    // 직원목록 데이터셑 호출 객체 
// global.gEmpList     = gEmpList;       // 직원목록 데이터 선언 
 
var gDeviceArr     = [];       // 설정상태 기기목록 콜렉션
var gDeviceCnt     = 0;        // 설정상태 기기수량 
var gDeviceOutStr  = "";       // 설정상태 기기목록 문자열 

// F10. 비상호출 대기 직원 정보전달 
function setDeviceStatusList(statusCdVal) {

    //gDeviceArr     = [];       // 설정상태 기기목록 콜렉션 초기화 
    //gDeviceCnt     = 0;        // 설정상태 수량 초기화 
    //gDeviceOutStr  = "";       // 설정상태 기기목록 문자열 초기화  

    deviceStatusSet.getDeviceFlagSet(statusCdVal);  // 상태코드값에 해당하는 콜렉션 설정 

    setTimeout( function(){   
        // callBack 호출받은뒤에 실행 
        // 이와 같이 호출시에 결과값을 리턴받을 수 있음. (비동기값을 회피 )   
        gDeviceArr      = deviceStatusSet.getResulSetArr(); 
        gDeviceCnt      = gDeviceArr.length;
        gDeviceOutStr   = deviceStatusSet.getResulSetStr(); 

        // console.log("EMP-V1 final outStr=" + gDeviceOutStr) ;
        // console.log("DVC-V2 Arr Length gDeviceCnt=" + gDeviceCnt) ;
         
        if ( gDeviceCnt > 0 ) {
            // 한개라도 자료가 있을 경우 내려보냄 
            console.log("DVC-V3 dcnt=" + gDeviceCnt + " / result=" + gDeviceOutStr);
        }; 
   
    }, 1000);
   
}; 
// EOF F10. 
 

 // 기기상태 점검 타이머
var deviceStatusChecker;            
var deviceCheckCnt      = 0;    // 체크 횟수 
var deviceCheckTime     = 3000; // 0.5초 간격으로 타임체크 

// F015. 타이머 기동 
function startDeviceChecker(statusCdVal) {

    console.log("\nDCC-100 START deviceStatusChecker "); 	
    
    // 체크 횟수 초기화 
    deviceCheckCnt = 0; 

    // 특정 시간 간격으로 체크진행 
    deviceStatusChecker = setInterval(function () {  					 		 
         
        // 상태목록 데이터 저장      
        setDeviceStatusList(statusCdVal); 
        
        deviceCheckCnt++; // 체크횟수 1증대 
        
        console.log("\nDCC-100 RUN check Cnt=" + deviceCheckCnt); 

    }, deviceCheckTime );	  	 

}; 
// EOF F15. 타이머   

// T99. 체커 기동중지 
function stopDeviceChecker() {
    
    if ( deviceStatusChecker != null ) {
        console.log("DCC-200 STOP deviceStatusChecker "); 
        clearInterval(deviceStatusChecker);
    };

}; 

// 기동과 동시에 A상태의 기기목록 호출 
startDeviceChecker("A"); 
 
// F20 ============================ 앱리스너 ===============================
/*
app.listen(PORT, () => {
  let msg; 
  msg = "miSocketServer V1.882 is running at: " + PORT; 
  //console.log('Node WebServer V1.877  is running at:', PORT);
  console.log(msg);   // 콘솔 
}); 

*/ 
  