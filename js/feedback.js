(function(){

let s=document.getElementById('stars')
 ,f=document.getElementById('starsFill')
 ,sc=document.getElementById('score')
 ,r=document.getElementById('rating')
 ,err=document.getElementById('feedbackError')

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
 err.style.display='none'
 rate(0)
}

document.getElementById('feedbackForm').onsubmit=e=>{
 e.preventDefault()
 let n=document.getElementById('name').value.trim()
let m=document.getElementById('message').value.trim()
 err.style.display='none'

 if(!n){
   err.textContent='⚠️ Please enter your name.'
   err.style.display='block'; return
 }


 if(!m){
   err.textContent='⚠️ Please enter your message.'
   err.style.display='block'; return
 }
 if(v<=0){
   err.textContent='⚠️ Please give us a star rating.'
   err.style.display='block'; return
 }
 let k='ourFestival.reviews.v1'
 let a=JSON.parse(localStorage.getItem(k)||'[]')
 a.unshift({n,m,v,ts:Date.now()})
 localStorage.setItem(k,JSON.stringify(a))

 // also send to server
 fetch('server/submit-feedback.php', {
   method:'POST', headers:{'Content-Type':'application/json'},
   body: JSON.stringify({name:n, message:m, rating:v})
 }).then(r=>r.json()).then(j=>{ if(!j.ok) console.warn('feedback server:', j); }).catch(e=>console.warn('feedback send error',e));

 window.location.href='index.html#reviewsSection'
}
})()