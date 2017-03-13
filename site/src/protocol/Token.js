class Token {
    static solve(challenge) {
        var lib = "var _ = {replace: function(){" +
				   "var args = arguments;" +
				   "var s = arguments[0];" + 
				   "return s.replace(args[1], args[2]);" +
				   "}};" +
				   "return ";
		var solver = new Function(lib + challenge);
		// return the solved token
		return solver().toString();
    }
    static resolve(headerToken, challengeToken) {
        headerToken = atob(headerToken);
		challengeToken = Token.solve(challengeToken);
		var token = "";
		for (var i = 0; i < headerToken.length; i++) {
		    var chr = headerToken.charCodeAt(i);
		    var mod = challengeToken.charCodeAt(i % challengeToken.length);
		    var dc = chr ^ mod;
		    token += String.fromCharCode(dc);
		}
		return token;
    }
    static request(pid) {
        var req = new Request(ukahoot.tokenServer + "?pid=" + pid, Token.requestConfig);
		return fetch(req);
    }
	static get() {
		return new Promise((resolve, reject) => {
			Token.request(ukahoot.pid).then(response => {
				response.json().then(resObject => {
					if (resObject.error) {
						reject(resObject.responseCode);
						return;
					} else {
						var challengeObject = null;
						resObject.responseBody = resObject.responseBody.replace('console.log("Offset derived as:", offset);', "");
						challengeObject = JSON.parse(resObject.responseBody);

						if (challengeObject !== null) {
							var token = Token.resolve(resObject.tokenHeader, challengeObject.challenge);
							resolve(token);
						} else reject("JSON parse error");
					}
				})
				}).catch(reject);
		});
	}
}
Token.requestConfig = {
	method: 'GET',
	headers: new Headers(),
	cache: 'default'
}