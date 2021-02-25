const debounce = (fn, debounceTime) => {
	let timeoutId;
	return function() {
			let newFn = () => fn.apply(this, arguments);
        
			clearTimeout(timeoutId);
        
			timeoutId = setTimeout(newFn, debounceTime);
	}
};

function onChange(e) {
	let searchValue = e.target;
	let results = document.body.querySelector('.searching_results');
	
	fetch(`https://api.github.com/users/${searchValue.value}/repos?q=page=1&per_page=5`)
  	.then(response => response.json())
  	.then(user => {
			results.innerHTML = '';
			user.forEach((commit) => {
				let commitEl = document.createElement('div');
				commitEl.className = 'searchingCommit';
				commitEl.textContent = commit.name;
				results.append(commitEl);
				commitEl.addEventListener('click', addChoosedCommit(commit, results, searchValue));
			})
		});
}

function addChoosedCommit(commit, results, searchValue) {
	return function() {
		let choosedCommitEl = document.createElement('div');
		choosedCommitEl.className = 'choosed_commit';
		choosedCommitEl.insertAdjacentHTML('beforeend',
			`<div class='commit_info'><div>Name: ${commit.name}</div>
						<div>Owner: ${commit.owner.login}</div>
						<div>Stars: ${commit.stargazers_count}</div></div>
			<div class='btn_close'></div>`);
		choosedCommitEl.querySelector('.btn_close').addEventListener('click', e => {
			e.target.closest('.choosed_commit').remove();
		});
		document.querySelector('.choosed_commits').append(choosedCommitEl);
		results.innerHTML = '';
		searchValue.value = '';
	};
}

onChange = debounce(onChange, 200);

document.getElementById('search').addEventListener('keyup', onChange);










