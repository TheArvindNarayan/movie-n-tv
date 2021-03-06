import React, { Component } from 'react'
import truncate from 'lodash-es/truncate'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import ImageProgressive from 'react-progressive-bg-image'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactCSS from 'react-css-modules'
import globalStyles from 'global-styles'

import { imageBase } from '../../APIs/config/'
import { uiStates, uiActions } from '../../redux-connect'
import styles from './styles'
import Details from '../../components/person-details'
import DetailsSkeleton from '../../components/person-details-skeleton'


@connect(uiStates, uiActions)
@withStyles(styles)
@ReactCSS({ ...globalStyles, ...styles }, { allowMultiple: true })
class People extends Component {

  constructor() {
    super()
    this.state = {
      mounted: false,
    }
  }

  componentDidMount() {
    this.setState({
      mounted: true,
    })
    const {
      params: {
        id,
      },
      ui: {
        person,
      },
    } = this.props

    if (!person[id]) {
      this.props.actions.getPerson(id, {
        append_to_response: 'movie_credits,images,external_ids',
      })
      .then(({ data }) => {
        this.props.actions.person({
          [id]: data,
        })
      })
    }
  }

  getleftPane(personData) {
    return <ImageProgressive
      className={styles['poster-img']}
      placeholder={`${imageBase}/w92${personData.profile_path}`}
      src={`${imageBase}/w500${personData.profile_path}`}
    />
  }

  random(max) {
    return Math.floor(Math.random() * (max));
  }

  render() {
    const {
      ui: {
        person,
      },
      params: {
        id,
      },
    } = this.props
    const personData = person[id]
    const backdrop = personData
      && personData.images
      && (
        personData.images.profiles.length > 0
          ? personData.images.profiles[this.random(personData.images.profiles.length)].file_path
          : personData.profile_path
      )
    return (
      <div styleName="people">
        {
          personData
          && <Helmet title={`${personData.name} - The Movie & TV`}>
            <meta content={`${imageBase}/w500${personData.profile_path}`} property="og:image" />
            <meta content="The Movie & TV" property="og:site_name" />
            <meta content="object" property="og:type" />
            <meta content={personData.name} property="og:title" />
            <meta content={`https://themovientv.com/people/${id}`} property="og:url" />
            <meta content={truncate(personData.biography, { length: 150 })} property="og:description" />

            <meta name="twitter:card" value="summary_large_image" />
            <meta name="twitter:site" value="@pranesh_ravi" />
            <meta name="twitter:creator" value="@pranesh_ravi" />
            <meta name="twitter:title" content={personData.title} />
            <meta name="twitter:description" content={truncate(personData.biography, { length: 150 })} />
            <meta name="twitter:image" content={`${imageBase}/w500${personData.profile_path}`} />
          </Helmet>
        }
        <div styleName="banner">
          <div styleName="image-container">
            {
              personData
              && this.state.mounted
              && <img src={`${imageBase}/w342${backdrop}`} alt=""/>
            }
          </div>
          <div styleName="fade-out"></div>
        </div>
        <div styleName="content container">
          <div styleName="row content">
            <div styleName="col-md-4 col-xs-9">
              <div styleName="poster">
                {
                  (personData && this.state.mounted)
                  ? this.getleftPane(personData)
                  : <div styleName="skeleton-placeholder poster-img placeholder" />
                }
              </div>
            </div>
            <div styleName="col-md-8 col-xs-12">
              {
                personData
                  ? <Details data={personData} />
                  : <DetailsSkeleton />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default People
