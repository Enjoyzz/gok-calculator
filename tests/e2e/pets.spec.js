// tests/e2e/pets.spec.js
import { test, expect } from '@playwright/test';

const URL = '/#/pets';

async function openPage(page) {
  await page.goto(URL);
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

// У диалога добавления/редактирования нет заголовка — опознаём по тексту секции
const petDialog = page => page.locator('.v-dialog').filter({ hasText: 'Выберите качество боевого питомца' });
const budgetDialog = page => page.locator('.v-dialog').filter({ hasText: 'Количество осколков' });
const clearDialog = page => page.locator('.v-dialog').filter({ hasText: 'Очистить список?' });

const confirmBtn = (dialog, name) =>
  dialog.locator('.v-card-actions').getByRole('button', { name, exact: true });

const petRows = (page, text) => page.locator('.v-list-item').filter({ hasText: text });
const menuItem = (page, text) => page.locator('.v-overlay__content .v-list-item').filter({ hasText: text });

// Выбираем первое доступное качество и действие «Призыв»
async function fillSummon(page) {
  const dialog = petDialog(page);
  await expect(dialog).toBeVisible();
  await dialog.locator('.v-chip').first().click();
  await dialog.getByText('Призыв', { exact: true }).click();
  return dialog;
}

async function addSummonPet(page, name) {
  await page.getByRole('button', { name: 'Добавить первого питомца' }).click();
  const dialog = await fillSummon(page);
  if (name) await dialog.getByLabel('Имя питомца (не обязательно)').fill(name);
  await confirmBtn(dialog, 'Добавить').click();
  await expect(dialog).toBeHidden();
}

test.describe('Калькулятор питомцев', () => {
  test('показывает пустое состояние', async ({ page }) => {
    await openPage(page);

    await expect(page.getByText('Пока не добавлено ни одного питомца')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Добавить первого питомца' })).toBeVisible();
    await expect(page.getByText('Итого очки')).toBeHidden();
  });

  test('кнопка «Добавить» недоступна, пока не выбрано действие', async ({ page }) => {
    await openPage(page);

    await page.getByRole('button', { name: 'Добавить первого питомца' }).click();
    const dialog = petDialog(page);
    await expect(dialog).toBeVisible();

    const addBtn = confirmBtn(dialog, 'Добавить');
    await expect(addBtn).toBeDisabled();

    await dialog.locator('.v-chip').first().click();
    await expect(addBtn).toBeDisabled();

    await dialog.getByText('Призыв', { exact: true }).click();
    await expect(addBtn).toBeEnabled();
  });

  test('добавляет питомца с призывом и показывает итоги', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page);

    await expect(petRows(page, 'Призыв')).toHaveCount(1);
    await expect(page.getByText('Итого очки')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Добавить боевого питомца' })).toBeVisible();
  });

  test('показывает имя питомца в списке', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page, 'Барсик');

    const row = petRows(page, 'Барсик');
    await expect(row).toHaveCount(1);
    await expect(row).toContainText('Призыв');
  });

  test('имя необязательно', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page);

    await expect(petRows(page, 'Призыв')).toHaveCount(1);
    await expect(page.locator('.v-list-item-title')).toHaveCount(0);
  });

  test('отмена закрывает диалог без добавления', async ({ page }) => {
    await openPage(page);

    await page.getByRole('button', { name: 'Добавить первого питомца' }).click();
    const dialog = await fillSummon(page);
    await dialog.getByRole('button', { name: 'Отмена' }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByText('Пока не добавлено ни одного питомца')).toBeVisible();
  });

  test('рассчитывает желаемый уровень по осколкам и добавляет питомца', async ({ page }) => {
    await openPage(page);

    await page.getByRole('button', { name: 'Добавить первого питомца' }).click();
    const dialog = petDialog(page);
    await dialog.locator('.v-chip').first().click();
    await dialog.getByText('Поднятие уровня', { exact: true }).click();

    const current = dialog.locator('input[type="number"]').first();
    const desired = dialog.locator('input[type="number"]').nth(1);

    // минимальный уровень берём из самого поля, чтобы не зависеть от конфига
    const minLevel = await current.getAttribute('min');
    await current.fill(minLevel);

    // «Рассчитать по осколкам» — кнопка внутри поля «Желаемый уровень»
    await dialog.locator('.v-field__append-inner button').click();

    const budget = budgetDialog(page);
    await expect(budget).toBeVisible();
    await budget.locator('input[type="number"]').fill('1000000000');
    await expect(budget.getByText(/хватит до ур\./)).toBeVisible();
    await budget.getByRole('button', { name: 'Применить' }).click();
    await expect(budget).toBeHidden();

    // желаемый уровень подставился и выше текущего
    await expect(desired).not.toHaveValue('');
    const desiredValue = Number(await desired.inputValue());
    expect(desiredValue).toBeGreaterThan(Number(minLevel));

    await confirmBtn(dialog, 'Добавить').click();
    await expect(dialog).toBeHidden();

    await expect(petRows(page, `Ур. ${minLevel} → ${desiredValue}`)).toBeVisible();
  });

  test('показывает ошибку, если желаемый уровень не выше текущего', async ({ page }) => {
    await openPage(page);

    await page.getByRole('button', { name: 'Добавить первого питомца' }).click();
    const dialog = petDialog(page);
    await dialog.locator('.v-chip').first().click();
    await dialog.getByText('Поднятие уровня', { exact: true }).click();

    const current = dialog.locator('input[type="number"]').first();
    const desired = dialog.locator('input[type="number"]').nth(1);
    const minLevel = await current.getAttribute('min');

    await current.fill(minLevel);
    await desired.fill(minLevel);

    await expect(dialog.getByText('Желаемый уровень должен быть выше текущего')).toBeVisible();
    await expect(confirmBtn(dialog, 'Добавить')).toBeDisabled();
  });

  test('редактирует питомца: меняет имя', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page, 'Барсик');

    await page.getByRole('button', { name: 'Действия' }).click();
    await menuItem(page, 'Редактировать').click();

    const dialog = petDialog(page);
    await expect(dialog).toBeVisible();

    const nameInput = dialog.getByLabel('Имя питомца (не обязательно)');
    await expect(nameInput).toHaveValue('Барсик');
    await nameInput.fill('Мурзик');
    await confirmBtn(dialog, 'Сохранить').click();
    await expect(dialog).toBeHidden();

    await expect(petRows(page, 'Мурзик')).toHaveCount(1);
    await expect(petRows(page, 'Барсик')).toHaveCount(0);
  });

  test('сохраняет питомцев после перезагрузки', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page, 'Барсик');
    await expect(petRows(page, 'Барсик')).toHaveCount(1);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(petRows(page, 'Барсик')).toHaveCount(1);
  });

  test('удаляет питомца через меню действий', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page);

    await page.getByRole('button', { name: 'Действия' }).click();
    await menuItem(page, 'Удалить').click();

    await expect(page.getByText('Пока не добавлено ни одного питомца')).toBeVisible();
  });

  test('очищает весь список с подтверждением', async ({ page }) => {
    await openPage(page);
    await addSummonPet(page);

    await page.getByRole('button', { name: 'Очистить всё' }).click();
    const confirm = clearDialog(page);
    await expect(confirm).toBeVisible();

    // отмена ничего не удаляет
    await confirm.getByRole('button', { name: 'Отмена' }).click();
    await expect(confirm).toBeHidden();
    await expect(petRows(page, 'Призыв')).toHaveCount(1);

    // подтверждение — удаляет
    await page.getByRole('button', { name: 'Очистить всё' }).click();
    await confirm.getByRole('button', { name: 'Очистить', exact: true }).click();

    await expect(page.getByText('Пока не добавлено ни одного питомца')).toBeVisible();
  });

  test('вкладка «Справочник» показывает таблицу уровней', async ({ page }) => {
    await openPage(page);

    await page.getByRole('tab', { name: 'Справочник' }).click();

    const table = page.locator('.v-table');
    await expect(table).toBeVisible();
    await expect(table.locator('thead th')).toHaveText(['Ур.', 'Осколки', 'Ягодки', 'Очки']);
    expect(await table.locator('tbody tr').count()).toBeGreaterThan(0);

    // переключатель не должен ломать таблицу
    await page.getByLabel('Накопительно (всего до этого уровня)').click();
    expect(await table.locator('tbody tr').count()).toBeGreaterThan(0);
  });
});
