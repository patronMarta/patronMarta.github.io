class ItemInfo {
    constructor(text, ind) {        
        this.itemText = text;
        this.masComments = [];
        this.countComments = 0;
        this.key = ind;
        this.isActive = false;
    }
    addComment(text) {
      this.masComments.push(text);
      this.countComments++;
    }
}


localStorage.clear();
initWindow();         /*for add init items and comments to application.
                       After restarting page items and comments will be without changes*/

var listItem = getListItems();   // for retrieving list of items from localStorage


function initWindow() {
  var lists = [];
  lists.push(new ItemInfo("First item about Angular", 0));
  lists[0].addComment("first item Achieve the maximum speed possible on the Web Platform today, and take it further, via Web Workers and server-side rendering.");
  lists[0].addComment("Angular puts you in control over scalability. Meet huge data requirements by building data models on RxJS, Immutable.js or another push-model. AngularJS has directives for binding application data to the attributes of HTML DOM elements. The ng-disabled Directive. ");
  lists[0].addComment("From prototype through global deployment, Angular delivers the productivity and scalable infrastructure that supports Google's largest applications.");
  lists.push(new ItemInfo("Second item text", 1));
  lists[0].isActive = true;
  lists[1].addComment("second item text Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.");
  lists.push(new ItemInfo("third item text", 2));
  lists.push(new ItemInfo("fourth item text", 3));
  lists[3].addComment("fourth item text Bootstrap makes front-end web development faster and easier. It's made for folks of all skill levels, devices of all shapes, and projects of all sizes.");
  lists[3].addComment("fBootstrap ships with vanilla CSS, but its source code utilizes the two most popular CSS preprocessors, Less and Sass.");
  lists[3].addComment("Quickly get started with precompiled CSS or build on the source.");
  lists[3].addComment("Take Bootstrap to the next level with official premium themes. Each theme is its own toolkit featuring all of Bootstrap, brand new components and plugins, full docs, build tools, and more.");
  lists[3].addComment("Millions of amazing sites across the web are being built with Bootstrap. Get started on your own with our growing collection of examples or by exploring some of our favorites.");
  for(let i = 0; i<lists.length; i++) {
    saveData(lists[i]);
  }
}

function saveData(item) {   // item - object ItemInfo
    var forKey = item.key;
    myJSON = JSON.stringify(item);
    localStorage.setItem(forKey, myJSON);
}

function retrievingData(forKey) {
  var text = localStorage.getItem(forKey);
  var item = JSON.parse(text);
  return item;
}

function getListItems() {      // Retrievin list items
  var list = [];
  var n = localStorage.length;
  for(let i = 0; i<n; i++) {
    let k = localStorage.key(i);
    list.push(retrievingData(k));
  }
  return list;
}

   

var app = angular.module('itemsApp', []); 
app.controller('addDetails', function($scope) {  
    $scope.itemsList = returnList();    
    $scope.itemsComment = showComments(0);
    $scope.activeItem = 0;

    function returnList() {
        var mas = [];
        if(listItem.length>0){
          listItem[0].isActive = true;        
        for(var i = 0; i<listItem.length; i++) {
            mas.push( { textItem:listItem[i].itemText, count:listItem[i].countComments} );
        }
        }
        return mas;
    }

    function showComments(ind) {
      var masComm = [];
      if(listItem.length>0){
         var comm = listItem[ind].masComments;
         for(var i = 0; i<comm.length; i++) {
            masComm.push({comment: comm[i]});
         }   
      }   
      return masComm;
    }
   
    $scope.addItem = function() {
      if($scope.inputName!="" && $scope.inputName!=undefined) {
        let k = +localStorage.key(localStorage.length-1) + 1;
        let el = new ItemInfo($scope.inputName, k);
        saveData(el);
        listItem.push(el);          
        $scope.itemsList.push({textItem:$scope.inputName, count:0});
        $scope.inputName = "";
        if(listItem.length == 1) {
           listItem[0].isActive = true;
           $scope.activeItem = 0;
           $scope.toActive(0);
        }
      }
      else {
        alert("Please, enter correct name");
      }
    };

    $scope.deleteItem = function(ind) {   
      var keyI = listItem[ind].key; 
      $scope.itemsList.splice(ind,1);       
      var isAct = listItem[ind].isActive;
      listItem.splice(ind,1);
      localStorage.removeItem(keyI);
      if(isAct) {        
        if($scope.itemsList.length>0) {
          if($scope.itemsList.length == ind) {            
             showActiveElement(ind-1);                        
             toActiveClass(ind-1);         
          }
          else {            
             showActiveElement(ind);             
             toActiveClass(ind+1);             
          }
        }
        else {
          $scope.itemsComment = [];          
        }
      }
      if(listItem.length==1) {
        $scope.toActive(0);
      }
    };

    $scope.toActive = function(ind) {          
      $scope.activeItem = ind;
      showActiveElement(ind);      
      toActiveClass(ind);   
    };

    function showActiveElement(ind) {
      for(var i = 0; i<listItem.length; i++) {
          listItem[i].isActive = false;          
      }
      listItem[ind].isActive = true;
      $scope.itemsComment = showComments(ind);
    }
    
    $scope.newComment = function(ev) {
      if(ev.key == "Enter") {
        var ind = $scope.activeItem; 
        var k = listItem[ind].key; 
        let el2 = retrievingData(k);     
        var text = $scope.inputComment;        
        if(text!="" && text!=undefined){          
          listItem[ind].masComments.push(text);
          listItem[ind].countComments ++;
          $scope.itemsList[ind].count = listItem[ind].countComments;
          $scope.itemsComment.push({comment: text});
          $scope.inputComment = null;
          localStorage.removeItem(k);
          saveData(listItem[ind]);          
        }      
      }
    }
    function toActiveClass(ind) {
      if(ind<0) ind++;    
      var elem = angular.element(document.getElementsByClassName("item"));
      if(elem.length > 0) {
         for(var i = 0; i<elem.length; i++) {      
          elem[i].classList.remove("activeItem");
         }
          elem[ind].classList.add("activeItem");  
      }    
    }
});

