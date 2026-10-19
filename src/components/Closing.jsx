import { dateNumeric } from '../lib/format.js';
import { useLang } from '../lib/lang.js';
import { Divider, FloralSprig } from './Ornaments.jsx';
import SaveInvitation from './SaveInvitation.jsx';

export default function Closing() {
  const { lang, t } = useLang();
  return (
    <footer className="section closing">
      <FloralSprig className="closing__floral reveal" />
      <p className="closing__line reveal">{t.closing.line}</p>
      <p className="eyebrow reveal">{t.closing.withLove}</p>
      <p className="closing__names reveal">{t.names.together}</p>
      <Divider className="reveal" />
      <SaveInvitation />
      <p className="closing__date">{dateNumeric(lang)}</p>
      <a className="lang-switch" href={t.switchTo.href} hrefLang={t.switchTo.lang} lang={t.switchTo.lang}>
        {t.switchTo.label}
      </a>
    </footer>
  );
}
