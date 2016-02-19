/// <reference path='../angular_module.ts' />
var fbChat;
define(function (require) {
    fbChat = require(["facebook-chat-api"]);
});

module CatStuff {
    export class BaseAreaController {
        private catPhoto: string = this.$sce.trustAsHtml("");
        
        private fbEmail: string;
        private fbPass: string;
        private userID: string;
        
        static $inject = ["$scope", "$http", "$sce"];
        constructor(
            private $scope: angular.IScope,
            private $http: angular.IHttpService,
            private $sce:angular.ISCEService
        ){
            this.$scope.$on("$destroy", this.dispose);
            
            this.getCatPhoto();
        }
        private dispose = () => {}
        
        private fbLogin = () => {
            fbChat({ email: this.fbEmail, password: this.fbPass }, (err, api) => {
                if(err) console.error(err);
                console.log("Success!");
            });
        }
        
        private enrollID = () => {
            fbChat({ email: this.fbEmail, password: this.fbPass }, (err, api) => {
                if(err) console.error(err);
                
                api.setOptions({listenEvents: true});
 
                var stopListening = api.listen(function(err, event) {
                    if(err) return console.error(err);
            
                    switch(event.type) {
                    case "message":
                        if(event.body === '/stop') {
                        api.sendMessage("Goodbye...", event.threadID);
                        return stopListening();
                        }
                        api.markAsRead(event.threadID, function(err) {
                        if(err) console.log(err);
                        });
                        api.sendMessage("TEST BOT: " + event.body, event.threadID);
                        break;
                    case "event":
                        console.log(event);
                        break;
                    }
                });
            });
        }
        
        private getCatPhoto = () => {
            this.$http.get("https://thecatapi.com/api/images/get?format=html")
            .then((retVal: {data: string}) => {
                this.catPhoto = this.$sce.trustAsHtml(retVal.data);
            });
        }
    }
    
    export function BaseAreaDirective(): angular.IDirective {
        return {
            controller: "BaseAreaController",
            controllerAs: "baseCtrl",
            templateUrl: "baseArea/baseAreaTemplate.html"
        };
    }
    
    angular.module(SPECIAL_NAMES.MODULE_NAME)
        .controller("BaseAreaController", BaseAreaController)
        .directive("baseArea", BaseAreaDirective);
}