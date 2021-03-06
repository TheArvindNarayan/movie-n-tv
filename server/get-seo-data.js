import { APIs } from '../app/APIs'

const getData = async (url, { id, seasonId }) => {
  const type = url.split('/')[1]
  if (id === undefined) {
    return {}
  }
  switch (type) {
    case 'movies':
      const { data: movieData } = await APIs.getMovie(id, {
        append_to_response: 'releases,images,videos,credits,similar,reviews',
      })()
      return {
        movies: {
          [id]: movieData,
        },
      }
    case 'tv':
      const { data: tvData } = await APIs.getTv(id, {
        append_to_response: 'content_ratings,videos,images,credits,recommendations',
      })()
      if (seasonId) {
        const { data: seasonData } = await APIs.getSeason(id, seasonId, {
          append_to_response: 'content_ratings,videos,images,credits,similar',
        })()
        return {
          tv: {
            [id]: tvData,
          },
          season: {
            [`${id}__${seasonId}`]: seasonData,
          },
        }
      }
      return {
        tv: {
          [id]: tvData,
        },
      }
    case 'people':
      const { data: peopleData } = await APIs.getPerson(id, {
        append_to_response: 'movie_credits,images,external_ids',
      })()
      return {
        person: {
          [id]: peopleData,
        },
      }
    default:
      return {}
  }
}

export default getData
