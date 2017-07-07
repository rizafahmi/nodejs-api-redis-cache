export const getUserRepositories = user => {
  const endpoint = `https://api.github.com/users/${user}/repos?per_page=100`
  return axios.get(endpoint)
}

export const computeTotalStars = repositories => {
  return repositories.data.reduce(
    (prev, curr) => {
      return prev + curr.stargazers_count
    },
    0
  )
}
