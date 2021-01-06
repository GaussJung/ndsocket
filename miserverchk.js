'use strict'; 

// VER 1.0 for ncsocket 
const express   = require('express');
 
const app   = express();
const PORT = process.env.PORT = 3000;
 
// 인원목록 출력 
var memberRouter  = require('./routes/member');    // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');    // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');

// 상태목록 호출 라이브러리  (경로명에 유의)
var checkStatusSet = require('./dataset/checkDeviceStatus');   

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


// 기동과 동시에 A상태의 기기목록 호출 
checkStatusSet.startDeviceChecker("A"); 
     
 
// 기동과 동시에 A상태의 기기목록 호출 
// OLD : startDeviceChecker("A"); 
 
// F20 ============================ 앱리스너 : 소켙만 열경우 필요없음 ===============================
 
app.listen(PORT, () => {
  let msg; 
  msg = "miSocketServer V1.882 is running at: " + PORT; 
  //console.log('Node WebServer V1.877  is running at:', PORT);
  console.log(msg);   // 콘솔 
}); 
 
  