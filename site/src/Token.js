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
        var req = new Request(window.tokenServer + "?pid=" + pid, window.requestConfig);
		return fetch(req);
    }
}