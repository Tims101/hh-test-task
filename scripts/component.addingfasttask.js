var FastTaskAddingPopoverComponent = function(options){
	var self = this;

	self.container = options.container;

	var addTaskBtn = self.container.querySelector("#add-task");
	var closeBtn = self.container.querySelector("span.close");
	var createBtn = self.container.querySelector("#create-task");
	var taskInput = self.container.querySelector("input");
	var popover = self.container.querySelector(".task-add-fast-popover");

	self.show = function(){
		addClass(addTaskBtn, "active");
		removeClass(popover, "hide");		
	};

	self.hide = function(){
		removeClass(addTaskBtn, "active");
		addClass(popover, "hide");	
	};

	self.bind = function(){
		var pressed = false;
		addTaskBtn.onmousedown = function(){
			if (!pressed){
				self.show();	
				taskInput.focus();
			} else {				
				self.hide();
			}

			pressed = !pressed;
		};

		taskInput.onkeypress = function(e){
			if (e.keyCode == 13){
				if (options.callback){
					if (!options.callback(taskInput.value)){									
						return;
					}
				}
				taskInput.value = "";
				self.hide();			
			}
		};

		closeBtn.onclick = function(){
			self.hide();	
		};

		createBtn.onclick = function(){
			if (options.callback){
				if (!options.callback(taskInput.value)){									
					return;
				}
			}

			taskInput.value = "";
			self.hide();
		};
	};

	self.bind();
};