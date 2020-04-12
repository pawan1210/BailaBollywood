var fbComments=document.getElementsByClassName('show-facebook-comments');
			  
fbComments[0].style.display='none';
var showBtn=document.getElementsByClassName('show-comments');
for(var i=0;i<showBtn.length;i++)
{
showBtn[0].addEventListener('click',function(){
    if(fbComments[0].style.display=='none')
    {
        fbComments[0].style.display='block';
        showBtn[0].innerHTML='Hide Comments';
    }
    else
    {
         fbComments[0].style.display='none';
         showBtn[0].innerHTML='Show Comment';
    }

})
}