var MainPopover = function(options){
	var self = this;

	self.element;

	self.container = options.container;	

	var closeBtn = self.container.querySelector("span.close");
	var triangle = self.container.querySelector("span.triangle");
	var createPanel = self.container.querySelector("#create-fields");

	var createPanelFields = {
		task: createPanel.querySelector("#create-task"),
		date: createPanel.querySelector("#create-date"),
		participants: createPanel.querySelector("#create-participants"),
		description: createPanel.querySelector("#create-description"),
		createBtn: createPanel.querySelector("#create"),
		deleteBtn: createPanel.querySelector("#delete")
	};

	self.reshow = function(){
		if (self.element) {
			self.show(self.element);
		}
	};

	self.show = function(toElement){			
		if (self.element) {
			removeClass(self.element, "selected");
		}

		self.element = toElement;

		addClass(toElement, "selected");

		var offset = 25;

		var getPos = function (element){			
		    var x=0;
		    var y=0;
		    while(true){
		        x += element.offsetLeft;
		        y += element.offsetTop;
		        if(element.offsetParent === null){
		            break;
		        }
		        element = element.offsetParent;
		    }

		    return  {x: x, y: y};		    
		}

		var getSize = function(element){
			var style = window.getComputedStyle(element);
			return {
				width: parseInt(style.width),
				height: parseInt(style.height)
			};
		};

		if (toElement){
			var myWidth = 300, myHeight = 330;
			var triangleWidth = 11;
			var winWidth, winHeight;
			var triangleOrientation;

			if (document.body && document.body.offsetWidth) {
				 winWidth = document.body.offsetWidth;
				 winHeight = document.body.offsetHeight;
			}

			if (document.compatMode=='CSS1Compat' &&
			    document.documentElement &&
			    document.documentElement.offsetWidth ) {
				 winWidth = document.documentElement.offsetWidth;
				 winHeight = document.documentElement.offsetHeight;
			}
			if (window.innerWidth && window.innerHeight) {
				 winWidth = window.innerWidth;
				 winHeight = window.innerHeight;
			}

			var elementPos = getPos(toElement);
			var elementSize  = getSize(toElement);

			var resultPos = {x: offset + elementPos.x + elementSize.width, y: elementPos.y};

			var triangleLeftPos = -triangleWidth;

			triangleOrientation = "left";
			if (resultPos.x + myWidth  > winWidth){
				resultPos.x -= 1.5 * offset + elementSize.width + myWidth; 
				triangleLeftPos = myWidth;
				triangleOrientation = "right";
			}

			if (resultPos.y + myHeight > winHeight){
				resultPos.y -= myHeight - (winHeight - resultPos.y);
			}

			var triangleTopPos = elementPos.y - resultPos.y + elementSize.height / 2;

			self.container.style.top = resultPos.y + 'px';
			self.container.style.left = resultPos.x + 'px';

			triangle.style.marginTop = triangleTopPos  + 'px';
			triangle.style.marginLeft = triangleLeftPos + 'px';
			removeClass(triangle, "triangle-right");
			removeClass(triangle, "triangle-left");
			addClass(triangle, "triangle-" + triangleOrientation);

			var get = function(d){
				if (d > 9) return d;
				return '0' + d;
			};

			var calendarData = toElement.calendarData;
			
			if (calendarData.data) {
				createPanelFields.createBtn.innerText = "Изменить";
				removeClass(createPanelFields.deleteBtn, "hide");
			} else {
				createPanelFields.createBtn.innerText = "Cохранить";
				addClass(createPanelFields.deleteBtn, "hide");
			}

			createPanelFields.date.value = get(calendarData.day) + '.' + get(calendarData.month + 1) + '.' + get(calendarData.year);

			createPanelFields.task.value = calendarData.data ? calendarData.data.task : '';
			createPanelFields.participants.value = calendarData.data ? calendarData.data.participants : '';
			createPanelFields.description.value = calendarData.data ? calendarData.data.description : '';
		};

		removeClass(self.container, "hide");
	};

	self.hide = function(){
		addClass(self.container, "hide");
		if (self.element) {
			removeClass(self.element, "selected");
			self.element = null;
		}
	};

	self.bind = function(){
		closeBtn.onclick = function(){
			self.hide();	
		};

		createPanelFields.deleteBtn.onclick = function(){
			if (options.deleteCallback) {
				var data = self.element.calendarData;
				options.deleteCallback(data.day, data.month, data.year);
			}	

			self.element.calendarData.data = null;
			self.hide();
		};

		createPanelFields.createBtn.onclick = function(){
			if (options.createCallback){
				var data = self.element.calendarData;

				var task = createPanelFields.task.value;
				var participants = createPanelFields.participants.value;
				var description = createPanelFields.description.value;

				options.createCallback(task, participants, data.day, data.month, data.year, description);
			}

			self.hide();
		};

		window.onresize = function(){
			if (self.element){
				self.show(self.element);
			}
		};
	};

	self.bind();
};