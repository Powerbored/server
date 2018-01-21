window.onload = function() {
	deleteArticle.addEventListener('click', function(e){
		const id = e.target.getAttribute('data-id');
		fetch('/articles/' + id, {
			method: 'DELETE',
			headers: new Headers(),
			mode: 'cors',
			cache: 'default',
			credentials: 'same-origin'
		}).then(function(res) {
			if (res.ok) {
				window.location = '/articles';
			} else {
				console.log(res.status || 'There was no response from the server');
			}
		}).catch(function(err) {
			console.log(err);
		});
	});
};