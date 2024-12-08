// tests/components/Navbar.test.ts
import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Navbar from '../../app/components/Navbar.vue'

describe('Navbar Component', () => {
  // Test 1: Component renders properly
  test('renders navbar component', () => {
    const wrapper = mount(Navbar)
    expect(wrapper.exists()).toBe(true)
  })

  // Test 2: All navigation links are present
  test('contains all required navigation links', () => {
    const wrapper = mount(Navbar)
    const links = wrapper.findAll('a')
    
    // Check number of links
    expect(links.length).toBe(6)
    
    // Check specific link text
    const expectedLinks = ['Home', 'About', 'Formulas', 'Traffic Data', 'Data View', 'API Docs']
    links.forEach((link: { text: () => any }, index: number) => {
      expect(link.text()).toBe(expectedLinks[index])
    })
  })
})