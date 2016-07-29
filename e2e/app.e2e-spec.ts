import { HashbrownPage } from './app.po';

describe('hashbrown App', function() {
  let page: HashbrownPage;

  beforeEach(() => {
    page = new HashbrownPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
