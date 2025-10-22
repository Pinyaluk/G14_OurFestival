(function(){

let s=document.getElementById('stars')
 ,f=document.getElementById('starsFill')
 ,sc=document.getElementById('score')
 ,r=document.getElementById('rating')

let v=0

function  rate(x){
 const rect=s.getBoundingClientRect()
let p=x-rect.left; if(p<0)p=0; if(p>rect.width)p=rect.width
 v=Math.round((p/rect.width*5)*2)/2

 f.style.width=(v/5*100)+'%'
sc.textContent=v?v:'0'
 r.value=v
}
s.addEventListener('click',e=>{ rate(e.clientX) })

document.getElementById('btnClean').onclick=()=>{
document.getElementById('name').value=''
 document.getElementById('message ').value=''
 rate(0)
 localStorage.removeItem('ourFestival.reviews.v1')
}

document.getElementById('feedbackForm').onsubmit=e=>{
 e.preventDefault()

 let n=document.getElementById('name').value.trim()||'Anonymous'
 ,m=document.getElementById('message').value.trim()

 if(!m){alert('กรุณาพิมพ์ข้อความ');return}
 let k='ourFestival.reviews.v1'

 let a=JSON.parse(localStorage.getItem(k)||'[]')
 a.unshift({n,m,v,ts:Date.now()})
 
localStorage.setItem(k,JSON.stringify(a))
 alert('ส่งเรียบร้อยแล้ว ขอบคุณครับ/ค่ะ!')
 e.target.reset();  rate(0)
}

})()
