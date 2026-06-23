import { AnnouncementModel } from '../models/Announcement.js';

export const createAnnouncement = async (req, res) => {
  const { titre, message, axe, niveau } = req.body;
  try {
    await AnnouncementModel.create({ titre, message, axe, niveau, auteur_id: req.user.id });
    res.status(201).json({ success: true, message: 'Annonce diffusée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur diffusion annonce.' });
  }
};

export const getStudentAnnouncements = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.findForStudent(req.user.axe, req.user.niveau);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur de récupération.' });
  }
};