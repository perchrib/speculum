class RequestService{

    async get(url) {
        var responseObj =  new ResponseObj();
        try{
            var response = await fetch(url);
            if(response.ok && response.status === 200){
                var content = await response.json();
                responseObj.setSuccess(content);
                return responseObj;
            }
            throw new Error(response.status)
        }
        catch (error){
            responseObj.setError("Could not load data. ", error);
            return responseObj;
        }
    }

    //TODO implement post, patch and other request here!
}
// ResponseObject that will be returned using the RequestService.js
class ResponseObj {
    constructor(){
        this.data = {};
        this.success = false;
        this.errorMessage = "";
        this.error = "";
    }
    setSuccess (data){
        this.success = true;
        this.data = data
    }
    setError (errorMessage, error){
        this.errorMessage = errorMessage;
        this.error = error;
    }
}

export default new RequestService()