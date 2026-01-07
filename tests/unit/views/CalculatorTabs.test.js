import {beforeEach, describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import {ref} from 'vue';
import CalculatorTabs from '@/views/CalculatorTabs.vue';
import CharmTab from '@/views/CharmTab.vue';
import IntimacyTab from '@/views/IntimacyTab.vue';
import {activeTabKey, calculatorDataKey, SharedKeySymbol} from '@/data/keys.js';

describe('CalculatorTabs.vue', () => {
  let activeTab;
  let isSharedView;
  let calculatorData;

  beforeEach(() => {
    isSharedView = ref(false);
    activeTab = ref('charm');
    calculatorData = ref({
      concubines: 3,
      ordos: 5,
      takya: 10,
      jadeBracelet: 2,
      sandalwoodBracelet: 4,
      goldEarrings: 8,
      gemRing: 6,
      loveLetter: 3,
      forage: 20
    })


  });

  const createWrapper = () => {
    return mount(CalculatorTabs, {
      global: {
        provide: {
          [activeTabKey]: activeTab,
          [calculatorDataKey]: { calculatorData },
          [SharedKeySymbol]: { isSharedView },
        },
        stubs: {
          CharmTab: true,
          IntimacyTab: true,
        },
      },
    });
  };

  describe('Initialization', () => {
    it('should initialize with charm tab active by default', () => {
      const wrapper = createWrapper();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.tab.active').text()).toBe('Обаяние');
    });

    it('should render both tabs', () => {
      const wrapper = createWrapper();

      const tabs = wrapper.findAll('.tab');
      expect(tabs).toHaveLength(5);
      expect(tabs[0].text()).toBe('Обаяние');
      expect(tabs[1].text()).toBe('Близость');
    });
  });

  describe('Tab switching', () => {
    it('should switch to intimacy tab when clicked', async () => {
      const wrapper = createWrapper();

      const intimacyTab = wrapper.findAll('.tab')[1];
      await intimacyTab.trigger('click');

      expect(activeTab.value).toBe('intimacy');
    });

    it('should switch to charm tab when clicked', async () => {
      activeTab.value = 'intimacy';
      const wrapper = createWrapper();

      const charmTab = wrapper.findAll('.tab')[0];
      await charmTab.trigger('click');

      expect(activeTab.value).toBe('charm');
    });

    it('should update active tab class when switching', async () => {
      const wrapper = createWrapper();

      // Initially charm tab should be active
      let tabs = wrapper.findAll('.tab');
      expect(tabs[0].classes()).toContain('active');
      expect(tabs[1].classes()).not.toContain('active');

      // Switch to intimacy
      await tabs[1].trigger('click');

      // After update
      tabs = wrapper.findAll('.tab');
      expect(tabs[0].classes()).not.toContain('active');
      expect(tabs[1].classes()).toContain('active');
    });
  });

  describe('Tab content rendering', () => {
    it('should render CharmTab when activeTab is charm', () => {
      activeTab.value = 'charm';
      const wrapper = createWrapper();

      expect(wrapper.findComponent(CharmTab).exists()).toBe(true);
      expect(wrapper.findComponent(IntimacyTab).exists()).toBe(false);
    });

    it('should render IntimacyTab when activeTab is intimacy', () => {
      activeTab.value = 'intimacy';
      const wrapper = createWrapper();

      expect(wrapper.findComponent(CharmTab).exists()).toBe(false);
      expect(wrapper.findComponent(IntimacyTab).exists()).toBe(true);
    });

    it('should not render both tabs simultaneously', () => {
      activeTab.value = 'charm';
      const wrapper = createWrapper();

      const charmTab = wrapper.findComponent(CharmTab);
      const intimacyTab = wrapper.findComponent(IntimacyTab);

      expect(charmTab.exists()).toBe(true);
      expect(intimacyTab.exists()).toBe(false);
    });
  });

  describe('Event emission', () => {
    it('should emit update-calculator-items from CharmTab', async () => {
      activeTab.value = 'charm';
      const wrapper = createWrapper();

      const testData = {items: 'test'};
      await wrapper.findComponent(CharmTab).vm.$emit('update-items', testData);

      expect(wrapper.emitted('update-calculator-items')).toBeTruthy();
      expect(wrapper.emitted('update-calculator-items')[0]).toEqual([testData]);
    });

    it('should emit update-calculator-items from IntimacyTab', async () => {
      activeTab.value = 'intimacy';
      const wrapper = createWrapper();

      const testData = {items: 'test'};
      await wrapper.findComponent(IntimacyTab).
          vm.
          $emit('update-items', testData);

      expect(wrapper.emitted('update-calculator-items')).toBeTruthy();
      expect(wrapper.emitted('update-calculator-items')[0]).toEqual([testData]);
    });

    it('should handle multiple update events', async () => {
      activeTab.value = 'charm';
      const wrapper = createWrapper();

      const testData1 = {first: 'update'};
      const testData2 = {second: 'update'};

      await wrapper.findComponent(CharmTab).vm.$emit('update-items', testData1);
      await wrapper.findComponent(CharmTab).vm.$emit('update-items', testData2);

      const emitted = wrapper.emitted('update-calculator-items');
      expect(emitted).toHaveLength(2);
      expect(emitted[0]).toEqual([testData1]);
      expect(emitted[1]).toEqual([testData2]);
    });
  });

  describe('Reactive tab changes', () => {
    it('should react to external activeTab changes', async () => {
      const wrapper = createWrapper();

      // Initially charm tab should be visible
      expect(wrapper.findComponent(CharmTab).exists()).toBe(true);
      expect(wrapper.findComponent(IntimacyTab).exists()).toBe(false);

      // Change activeTab externally
      activeTab.value = 'intimacy';
      await wrapper.vm.$nextTick();

      // Now intimacy tab should be visible
      expect(wrapper.findComponent(CharmTab).exists()).toBe(false);
      expect(wrapper.findComponent(IntimacyTab).exists()).toBe(true);
    });

    it('should update tab appearance when activeTab changes externally',
        async () => {
          const wrapper = createWrapper();

          // Change activeTab externally
          activeTab.value = 'intimacy';
          await wrapper.vm.$nextTick();

          const tabs = wrapper.findAll('.tab');
          expect(tabs[0].classes()).not.toContain('active');
          expect(tabs[1].classes()).toContain('active');
        });
  });

  describe('Accessibility and UX', () => {
    it('should have proper tab roles and attributes', () => {
      const wrapper = createWrapper();

      const tabs = wrapper.findAll('.tab');
      tabs.forEach(tab => {
        expect(tab.attributes('role')).toBeUndefined(); // или 'tab' если используется
        expect(tab.attributes('tabindex')).toBeUndefined();
      });
    });

    it('should be keyboard accessible if implemented', async () => {
      // Этот тест можно расширить если добавить keyboard navigation
      const wrapper = createWrapper();

      const tabs = wrapper.findAll('.tab');
      expect(tabs).toHaveLength(5);
    });
  });
});