const db = require("./db");



const getAll = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM donnees')
        if (!!result) {
            console.log(result)
            return res
                .status(200)
                .send(result.map(row => ({
                    id: row.id,
                    id_capteur: row.id_capteur,
                    batterie: row.batterie,
                    distance: row.distance,
                    id_position: row.id_position
                })))
        } else {
            return res.status(400).send({
                success: false,
                msg: `Aucun capteur à afficher `
            })
        }

    } catch (error) {
        console.error('Error :', error)
        throw error
    }
}

const getId = async (req, res) => {
    try {
        const id = req.params.id
        console.log('capteur ID = ' + id)
        const [rows] = await db.query('SELECT * FROM donnees WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                msg: `Le capteur avec l'ID = ${id} n'existe pas`
            });


        }
        const row = rows[0];
        console.log(row);
    } catch (error) {
        console.error('Error:', error)
        return res.status(500).send({
            success: false,
            msg: 'Server error'
        })
    }
}

const add = async (req, res) => {
    try {
        const {id_capteur, batterie, distance, id_position} = req.body
        const [result] = await db.query('INSERT INTO info (id_capteur, batterie, distance, id_position) VALUES (?, ?, ?, ?)', [firstname, lastname, age, image])
        res .status(201)
            .send({
            id: result.insertId,
            id_capteur,
            batterie,
            distance,
            id_position
        });
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send({
            success: false,
            msg: 'Server error'
        });
    }
}

const sup = async (req, res) => {
    try {
        const id = req.params.id
        console.log('Suppression du capteur avec l\'ID = ' + id)
        const [result] = await db.query('DELETE FROM donnees WHERE id = ?', [id])
        if (result.affectedRows > 0) {
            res.status(200).send({
                success: true,
                msg: `le capteur avec l'ID = ${id} est bien supprimé `
            })
        } else {
            res.status(404).send({
                success: false,
                msg: `le capteur avec l'ID = ${id} n'existe pas`
            })
        }
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send({
            success: false,
            msg: 'Server error'
        })
    }

}

const update = async (req, res) => {
    try {
        const id = req.params.id
        const {id_capteur, batterie, distance, id_position} = req.body
        const [result] = await db.query('UPDATE donnees SET id_capteur = ?, batterie = ?, distance = ?, id_position = ? WHERE id = ?', [id_capteur, batterie, distance, id_position, id])
        if (result.affectedRows > 0) {
            res.status(200).send({
                id,
                id_capteur,
                batterie,
                distance,
                id_position
            })
        } else {
            res.status(404).send({
                success: false,
                msg: `le capteur avec l'ID = ${id} n'existe pas`
            })
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            success: false,
            msg: 'Server error'
        })
    }
}

module.exports = {getAll, getId, add, sup, update}
