var body = $response.body.replace(/sday":"[^"]*"/g, 'sday":"2029-12-01 00:00:00"')
		.replace(/eday":"[^"]*"/g, 'eday":"2029-12-30 00:00:00"')
		.replace(/intval":\d/g, 'intval":0')
$done({ body });