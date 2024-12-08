import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from '../../app/components/Hero.vue'

describe('Hero Component', () => {
  // Test 1: Component renders properly
  test('renders hero component', () => {
    const wrapper = mount(Hero)
    expect(wrapper.exists()).toBe(true)
  })

  // Test 2: Check content
  test('displays correct content', () => {
    const wrapper = mount(Hero)
    
    // Check main title
    const title = wrapper.find('h1')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Manneken Data')
    
    // Check subtitle
    const subtitle = wrapper.find('p')
    expect(subtitle.exists()).toBe(true)
    expect(subtitle.text()).toBe('A data science tool')
  })
})