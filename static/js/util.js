if(!String.fishformat) {
    String.prototype.fishformat = function() {
        var imgPattern = /\b(?:img|image)\s?\[(.+?)\]/gim;
        var urlPattern = /\b(?:url|link)\s?\[(.+?)\]/gim;

        return this
            .replace(imgPattern, '<img src="$1">')
            .replace(urlPattern, '<a href="$1">$1</a>');
    };
}
