if ($request.url.indexOf("app/ad/queryInfoFlow") != -1) {
    var ddgksf2013 = JSON.parse($response.body);
    ddgksf2013.obj = Object.values(ddgksf2013.obj).filter((item) => item.adverId==2833);
    $done({
        body: JSON.stringify(ddgksf2013),
    });
}