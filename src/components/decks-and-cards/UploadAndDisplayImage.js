import React, { useContext, useEffect, useState } from "react";
import { storage } from "../../firebase/firebaseIndex";
import { firebaseAuth } from "../../provider/AuthProvider";

const UploadAndDisplayImage = ({
    onSetImage,
    imageRef
}) => {
    const [image, setImage] = useState(null);
    const [filePath, setFilePath] = useState(imageRef);
    const { user } = useContext(firebaseAuth);

    useEffect(() => {
        if (imageRef) {
            console.log(imageRef);
            storage.ref(imageRef).getDownloadURL().then((downloadURL) => {
                setImage(downloadURL)
            });
            setFilePath(imageRef)
        }
    }, [imageRef]);

    return (
        <div style={{paddingBottom: 20}}>
            {filePath && (
                <div>
                    <img alt="not fount" width={"250px"} src={image} />
                    <br />
                    <button onClick={() => {
                        const deleteTask = storage.ref(filePath).delete();
                        deleteTask.then(() => {
                            console.log('File deleted successfully');
                            onSetImage(null)
                        }).catch((error) => {
                        });
                    }}>Remove</button>
                </div>
            )}
            <br />

            <br />
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    if (filePath) {
                        const deleteTask = storage.ref(filePath).delete();
                        deleteTask.then(() => {
                            console.log('File deleted successfully');
                            onSetImage(null)
                        }).catch((error) => {
                            
                        });
                    }

                    const uploadTask = storage.ref(`${user.uid}/${event.target.files[0].name}`).put(event.target.files[0]);
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                        },
                        () => {
                            storage.ref(`${user.uid}`).child(event.target.files[0].name).getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                onSetImage(`${user.uid}/${event.target.files[0].name}`);
                                setImage(downloadURL)
                                setFilePath(`${user.uid}/${event.target.files[0].name}`)
                            });
                        }
                    );
                }}
            />
        </div>
    );
};

export default UploadAndDisplayImage;