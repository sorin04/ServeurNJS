const db = require('../mysql/db'); // Assure-toi que le fichier db.js est bien configuré pour la connexion MySQL

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe dans la base de données
        const [rows] = await db.query('SELECT * FROM utilisateurs WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, msg: 'Utilisateur non trouvé' });
        }

        const user = rows[0];

        // Comparer les mots de passe en texte brut (tu pourrais utiliser bcrypt pour la comparaison des mots de passe cryptés)
        if (password === user.password) {
            return res.status(200).json({
                success: true,
                msg: 'Connexion réussie',
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        } else {
            return res.status(401).json({ success: false, msg: 'Mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.status(500).json({ success: false, msg: 'Erreur serveur' });
    }
};

module.exports = { login };
