'use strict';

var express = require('express');

var router = express.Router();
 
var dbConnector = require('../config/dbConnector');

// 비상정보 내려보내기 
function EmgrgencyView(request, response, bnum) {

    let   ecdVal       = "E" + parseInt(bnum); 
    let   sqlBody      = ""; 
    
    if ( bnum  > 0 ) {
        sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE ecd = '" + ecdVal + "'"; 
    }
    else {
        sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE eflag = 100 "; 
    }; 

    // 시간측정 
    console.time("DBEX02"); 

    console.log("B111 bnum=" + ecdVal); 

    
    dbConnector.getConnection(function(conn) {
        conn.query(sqlBody)
            .then((results) => {
                    
                // console.log(results); //[ {val: 1}, meta: ... ]
                
                //Output
                let output = {};
                let temp = [];
                output.datas = results;
                
                // 결과값 
                console.log("DG11 DB DATAS=" +  JSON.stringify(output.datas) );

                dbConnector.sendJSON(response, 200, output);
            })
            .then((res) => {
                // console.log('RE-111 res = ' + res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                conn.end();
            })
            .catch(err => {
                //handle error
                console.log(err);
                conn.end();
            })
    });

    console.timeEnd("DBEX02"); 
}; 





// F20 ============================ DB호출 ===============================

// 일반호출 :   http://localhost/first.html
// 인명목록호출 :   http://localhost/namelist
// 인명목록호출 : 인자(최소값)  http://localhost/namelist?bnum=50
// res : response, bnum : bottom number  
function viewData(res, bnum) {
 
  const mysql         = require('mysql');
  const dbconfig      = require('../config/database.js');

  let   connection    = mysql.createConnection(dbconfig);
 
   let   ecdVal       = "E" + parseInt(bnum); 
   let   sqlBody      = ""; 
   
   if ( bnum  > 0 ) {
       sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE ecd = '" + ecdVal + "'"; 
   }
   else {
       sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE eflag = 100 "; 
   }; 
     //  F5 
  
   // CF1-START
   connection.query(sqlBody, function (err, rows, fields) {
     
      if (err) throw err;

  		// 시간측정 
   		console.time("DBEX01"); 

        // console.log(' == UserName: ', rows  );
        
        // 전체 출력 
        // res.send(rows);
        // return false; 

        let i = 0;
        let outData = ""; 
        let outTmp  = ""; 
        let rowStr; 
        let outAll = []; 

        // For-D1 
        for ( i in rows ) {

            // outTmp  = `${rowStr}<p>` ;  // 표현요소 함께 전달 ( 별로 안 좋음 )
            // console.log( i, ' >>> rowStr=', rowStr); 
            // outData += rowStr;  // 문자열 
            // outData += outTmp;  // 문자열에 줄바꿈 추가 
            // JSON객체에 객체 추가 
       
            // console.log( i, ' >>> Data Value  rcd=', rows[i].rcd, ' NAME=' + rows[i].name); 

            rowStr  = JSON.stringify(rows[i]); 
          
            outAll.push(rows[i]); 
     
        }; 
        // EOF For-D1  

        // rows 는 아래의 outAll 과 동일, 즉 레코드셑은 JSON 배열로 반환 
        console.log( 'VN-400 ==========  outAll = ' +  JSON.stringify(outAll) ); 
       
        // console.log( 'VN-500 ============ ENDING Conn V1.817 =============== '); 
        res.send(outAll);
        // res.send(outData);
        console.timeEnd("DBEX01"); 
        
      });
      // CF1-END 
}; 
// EOF viewData 
   

// 일반접속이 특이하게 풀링보다 빠름. 
// G1  localhost/namelist  호출시 목록 출력
// 아래와 같이 호출시에 목록을 get 및 post방식 모두로 호출함.  
router.get('/', (req, res) => {
 
    let bnum = req.query.bnum;  // similar to req.param('bnum');

    // 직원코드 확인 없으면 0 
  if ( bnum == null || bnum == undefined) {
        bnum = 0; 
   }; 

      
  console.log("VN-A1 Post bval=" + bnum);

  EmgrgencyView(req, res, bnum); 
});

// POST 
router.post('/', (req, res) => {

  let bnum = req.body.bnum;   // similar to 포스트 bnum 

    // 직원코드 확인 없으면 0 
    if ( bnum == null || bnum == undefined) {
        bnum = 0; 
      }; 
 
    console.log("VN-A2 Post bval=" + bnum);
    EmgrgencyView(req, res, bnum); 
});
 
module.exports = router;
// module.exports = new emgCall();

 