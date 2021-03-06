import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {fetchStories, clearStories} from '../../../actions/index'
import PostItem from '../../items/post-item/post-item'
import StoryPlaceholder from '../../../components/placeholders/story-placeholder/story-placeholder'
import AlgoliaPost from '../../../components/algolia-post/algolia-post'
import autobind from 'autobind-decorator'

class AllStories extends Component {
  constructor (props) {
    super(props)

    this.state = {
      limit: 40,
    }
  }

  componentWillMount () {
    this.props.location.pathname === '/' ? this.props.fetchStories('topstories') : this.props.fetchStories(`${this.props.location.pathname.slice(1)}stories`)
    window.addEventListener('scroll', this.handleOnScroll)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.clearStories()
      nextProps.location.pathname === '/' ? this.props.fetchStories('topstories') : this.props.fetchStories(`${nextProps.location.pathname.slice(1)}stories`)      
    }
  }
  
  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleOnScroll)
  }

  @autobind
  handleOnScroll () {
    const pctScrolled = Math.floor((window.pageYOffset/(window.innerHeight - document.body.scrollHeight) * 100) * -1) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    if (pctScrolled >= 85) {
      this.setState({
        limit: Math.min(this.state.limit + 30, this.props.items.length - 1)
      })
    }
  }

  @autobind
  onTopClick () {
    window.scrollTo(0, 0)
  }

  renderPlaceholders () {
    const storyPlaceholders = []
    for (var i = 1; i < 41; i++) {
      storyPlaceholders.push(<StoryPlaceholder key={i} />)
    }
    return storyPlaceholders.map(story => {
      return story
    })
  }

  renderPosts () {
    return this.props.items.slice(0, this.state.limit + 1).map(id => {
      return <PostItem id={id} key={id} />
    })
  }

  render () {
    if (!this.props.items) return <div className='new-stories'><div className='posts-list'>{this.renderPlaceholders()}</div></div>
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

function mapStateToProps ({items}) {
  return {items: items.items}
}

export default connect(mapStateToProps, {fetchStories, clearStories})(AllStories)
