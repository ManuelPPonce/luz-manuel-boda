import handler from '../[...path].js';

export default function guestSearch(req, res) {
  req.query = { ...req.query, path: ['guests', 'search'] };
  return handler(req, res);
}
