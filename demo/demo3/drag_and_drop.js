      var outer_container_id  = "external";
      var divContTemplateId = "small_cont";
      var divDragTemplateId = "draggable_item";

      //Make the effect of items moving, towards the direction given in input 
      //('right' and 'left' are just string values, they will work fine even to vertical moving )
      //it works recursively checking if the neighbor container is empty,
      //A sort of pseudo-code:
      //If the current container is empty, return it
      //else if we are trying to move towards right and the current container is the last one, return 'wall'
      //else ask next container whether is it empty (thus, if is it different to 'wall'):
      //  if it is, move inside it the current item and return the current (empty) container
      function shift(parentNode, direction){

      var id_parent = parentNode.id;
     
      if (parentNode.children.length == 0)
           return parentNode;

      var iString = id_parent.substring(divContTemplateId.length,id_parent.length);
      var i = parseInt(iString);
      var max = document.getElementById(outer_container_id).children.length;
      if(i == max && direction=="right")
        return "wall";
      
      var next = (direction == "right" ? parentNode.nextElementSibling : parentNode.previousElementSibling );

      var recursion = shift(next,direction); 
      if (recursion != "wall"){
        var my_item_to_append = parentNode.firstElementChild;
        recursion.appendChild(my_item_to_append);
        return parentNode;
      }
      return "wall";

      }


      //create an hidden div in which 'park' the current dragged item
      function createHiddenDiv(){
        var className = "hiddenDiv";
        var elements = document.getElementsByClassName(className);
        if(elements.length == 0){
          var div = document.createElement("div");
          document.body.appendChild(div);
          div.style.display = "none";
          div.className = "hiddenDiv";
          return div;
        }else
          return document.getElementsByClassName(className)[0];
      }


      function removeHiddenDivs(){
        var className = "hiddenDiv";
        //actually there is just one element in the array, anyway it works fine, leave it alone :)
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
        }
      }


      var dragged_id;

      
      function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        dragged_id = ev.target.id;
      }


      function allowDrop(ev,item) {
        ev.preventDefault();
        var data = dragged_id;
        var div = createHiddenDiv();
        div.appendChild(document.getElementById(data));
        if (shift(item,"right") == "wall")
          shift(item,"left");

      }


      function drop(ev,item) {
        ev.preventDefault();
        var data = dragged_id;   
        item.appendChild(document.getElementById(data));
      }


      function dragEnd()
      {
        var containers = document.getElementById(outer_container_id).children;
        for(var i=0; i < containers.length; i++)
          if (containers[i].children.length == 0)
            containers[i].appendChild(document.getElementById(dragged_id));
        removeHiddenDivs();
      }
