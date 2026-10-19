import { dateNumeric } from '../lib/format.js';
import { useLang } from '../lib/lang.js';
import { Divider, FloralSprig, Icon } from './Ornaments.jsx';

export default function Cover() {
  const { lang, t } = useLang();
  return (
    <header className="cover">
      <FloralSprig className="cover__floral cover__floral--top" />
      <FloralSprig className="cover__floral cover__floral--bottom" />

      <div className="cover__card">
        <p className="eyebrow cover__anim" style={{ '--d': '0.1s' }}>{t.cover.eyebrow}</p>

        <h1 className="names cover__anim" style={{ '--d': '0.3s' }}>
          <span className="names__name">{t.names.first}</span>
          <span className="names__amp">{t.names.joiner}</span>
          <span className="names__name">{t.names.second}</span>
        </h1>

        <p className="cover__type cover__anim" style={{ '--d': '0.55s' }}>{t.cover.type}</p>

        <Divider className="cover__anim" />

        <p className="cover__date cover__anim" style={{ '--d': '0.75s' }}>{dateNumeric(lang)}</p>

        <a className="btn btn--ghost cover__anim" href="#invitation" style={{ '--d': '0.95s' }}>
          <span>{t.cover.open}</span>
          <Icon name="arrow" />
        </a>
      </div>
    </header>
  );
}
