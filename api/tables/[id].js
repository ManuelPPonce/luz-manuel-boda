import handler from '../[...path].js';

export default function tableById(req, res) {
  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  req.query = { ...req.query, path: ['tables', String(id || '')] };
  return handler(req, res);
}
