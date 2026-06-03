function searchNews(){

let keyword = document
.getElementById(
"searchInput"
).value;

if(keyword===""){

alert(
"Please enter a keyword."
);

}

else{

alert(
"Searching for: "
+ keyword
);

}

}
