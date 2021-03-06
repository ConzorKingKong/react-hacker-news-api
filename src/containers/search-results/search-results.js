import React, {Component} from 'react'
import {connect} from 'react-redux'
import {clearStories, search} from '../../actions/index'
import StoryPlaceholder from '../../components/placeholders/story-placeholder/story-placeholder'
import AlgoliaPost from '../../components/algolia-post/algolia-post'
import autobind from 'autobind-decorator'

class SearchResults extends Component {
  constructor (props) {
    super(props)

    this.state = {
      limit: 30
    }
  }

  componentWillMount () {
    window.addEventListener('scroll', this.handleOnScroll)
  }

  componentWillUnmount () {
    this.props.clearStories()
    window.removeEventListener('scroll', this.handleOnScroll)
  }

  @autobind
  handleOnScroll () {
    const pctScrolled = Math.floor((window.pageYOffset/(window.innerHeight - document.body.scrollHeight) * 100) * -1) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    if (pctScrolled >= 85) {
      this.setState({
        limit: Math.min(this.state.limit + 30, this.props.items.items.hits.length - 1)
      })
    }
  }

  @autobind
  onTopClick () {
    window.scrollTo(0, 0)
  }

  renderPlaceholders () {
    const storyPlaceholders = []
    for (var i = 1; i < 31; i++) {
      storyPlaceholders.push(<StoryPlaceholder key={i} />)
    }
    return storyPlaceholders.map(story => {
      return story
    })
  }

  renderPosts () {
    return this.props.items.items.hits.slice(0, this.state.limit).map(post => {
      return <AlgoliaPost id={parseInt(post.objectID)} key={parseInt(post.objectID)} score={post.points} title={post.title} by={post.author} time={post.created_at_i} />
    })
  }

  render () {
    if (!this.props.items.items) return <div className='new-stories'><div className='posts-list'>{this.renderPlaceholders()}</div></div>
    if (this.props.items.items.hits.length === 0) return <div>No results for "{this.props.items.items.query}"</div>
    return (
      <div className='new-stories'>
        <div className='posts-list'>
          {this.renderPosts()}
        </div>
        <button onClick={this.onTopClick} className='pagination-button'>Top</button>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps, {clearStories, search})(SearchResults)
