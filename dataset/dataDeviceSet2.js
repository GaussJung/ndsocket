 'use strict'; 
 
 // F20 ============================ DB호출 : 방식2 프리미스 ===============================
  
const mariadb       = require('mariadb/callback');
const dbconfig      = require('../config/miDBConfig');   // 동일 디렉토리 설정화일 확인 
 
// let  connection     = mariadb.createConnection(dbconfig);
 
var resultSetArr     = [];       // 결과값 배열 
 
/* 
const getDeviceFlagSet = function(statusCdVal) { 
 
    let connection     = mariadb.createConnection(dbconfig);

    let sqlBody = "SELECT deviceid, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5"; 
 
     // 성공시 resolve, 실패시 reject 
     return new Promise(function(resolve, reject){
       // SQL 호출 
       connection.query(sqlBody,  [statusCdVal], 
           function(err, results){                                                
               if( results === undefined){
                 reject(new Error("E10-results is undefined"));
                 connection.end(); 
               }
               else{
                 console.log('S10 results=' + JSON.stringify(results) ) ; 
                 resolve(results);
                 connection.end(); 
               };
           }
       )}
   )};
 
*/ 

// 기기 세트 
function getDeviceFlagSet (statusCdVal) { 
 
    let connection     = mariadb.createConnection(dbconfig);

    let sqlBody = "SELECT deviceid, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5"; 

    // R1성공시 resolve, 실패시 reject 
    return new Promise(function(resolve, reject){
        // SQL 호출 
        connection.query(sqlBody,  [statusCdVal], function(err, results){                                                
            if( results === undefined){
                reject(new Error("E101-results is undefined"));
                connection.end(); 
            }
            else{
                console.log('S101 results=' + JSON.stringify(results) ) ; 
                resolve(results);
                connection.end(); 
            };
        })
        // EOF connection.query 
    });
  // EOF Promise 
};
// EOF getDeviceFlagSet



// 기기 세트 
var  getDeviceFlagSet2 = function(statusCdVal) { 
 
  let connection     = mariadb.createConnection(dbconfig);

  let sqlBody = "SELECT deviceid, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5"; 

  // R1성공시 resolve, 실패시 reject 
  return new Promise(function(resolve, reject){
      // SQL 호출 
      connection.query(sqlBody,  [statusCdVal], function(err, results){                                                
          if( results === undefined){
              reject(new Error("E101-results is undefined"));
              connection.end(); 
          }
          else{
              console.log('S101 results=' + JSON.stringify(results) ) ; 
              resolve(results);
              connection.end(); 
          };
      })
      // EOF connection.query 
  });
// EOF Promise 
};
// EOF getDeviceFlagSet2


// 레코드셑 보기 
const  renderSetView = () => console.log( "RET2=" + JSON.stringify(resultSetArr) ); 
 
/* 
 // 프리미스 함수 호출 
 getDeviceFlagSet(100)
 .then( function(results){ 
     // 공용결과셑에 설정 
     resultSetArr = results; 
     renderSetView();  
 })
 .catch(function(err){
   console.log("P10 Promise rejection error: " + err);
 })
 */ 

 // 결과출력 
 // var render = (rset) => console.log( "RET=" + JSON.stringify(rset) ); 
// 결과출력2 
  

// 결과세트 확인 
exports.getResulSetArr = function() {
  return resultSetArr;
}; 

 
// 호출방법  getEmpFlagSet(100)
console.log("\nDS V1.4 DataDeviceSet"); 

exports.getDeviceFlagSet = getDeviceFlagSet;  
 