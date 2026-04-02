import { Router } from 'express';

const nonConformityRoutes = Router();

nonConformityRoutes.post('/non-conformity', (req, res) => res.end(req.url));
nonConformityRoutes.get('/non-conformity', (req, res) => res.end(req.url));
nonConformityRoutes.get('/non-conformity/:id', (req, res) => res.end(req.url));
nonConformityRoutes.put('/non-conformity', (req, res) => res.end(req.url));
nonConformityRoutes.delete('/non-conformity', (req, res) => res.end(req.url));

// Essa vai ser para atualizar o responsável
nonConformityRoutes.patch('/non-conformity/:id/assigne/:user', (req, res) => res.end(req.url));

// Essa vai ser para atualizar a data de expiração
nonConformityRoutes.patch('/non-conformity/:id/due-date/:date', (req, res) => res.end(req.url));

// Essa vai ser para finalizar a não conformidade
nonConformityRoutes.patch('/non-conformity/:id/fisish', (req, res) => res.end(req.url));

// Falta imaginar para atualizar os status

export default nonConformityRoutes;
