import handler from '../[...path].js';

export default function confirmedById(req, res) {
  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  req.query = { ...req.query, path: ['confirmed', String(id || '')] };
  return handler(req, res);
}
