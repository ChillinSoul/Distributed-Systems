import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../../app/components/Card.vue'

describe('Card Component', () => {
  // Test 1: Component renders with props
  test('renders with provided props', () => {
    const testProps = {
      title: 'Test Title',
      description: 'Test Description'
    }
    
    const wrapper = mount(Card, {
      props: testProps
    })
    
    expect(wrapper.find('h2').text()).toBe(testProps.title)
    expect(wrapper.find('p').text()).toBe(testProps.description)
  })

  // Test 2: Component handles empty props
  test('renders with empty props', () => {
    const wrapper = mount(Card, {
      props: {
        title: '',
        description: ''
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('')
    expect(wrapper.find('p').text()).toBe('')
  })
})