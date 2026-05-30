import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const AddBrandModal = ({
    visible,
    onClose,
    onCreate,
    categories = [],
    mode = "create",
    brandData = null,
}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [openCategory, setOpenCategory] = useState(false);

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.7,
            });

            console.log("IMAGE RESULT:", result);

            if (!result.didCancel && result.assets?.length > 0) {
                setImage(result.assets[0]);
            }

        } catch (error) {
            console.log("IMAGE ERROR:", error);
        }
    };

    const handleCreate = () => {
        if (!name.trim()) return;

        const newBrand = {
            name,
            category,
            image,
        };

        onCreate(newBrand);

        // reset
        setName('');
        setCategory('');
        setImage(null);
        setOpenCategory(false);
    };

    const handleSubmit = () => {
        if (!name.trim()) return;

        const payload = {
            ...brandData,
            name,
            category,
            image,
        };

        onCreate(payload, mode);

        setOpenCategory(false);
    };


    useEffect(() => {
        if (brandData && mode === "edit") {
            setName(brandData.name || '');
            setCategory(brandData.category?._id || '');
            setImage(
                brandData.image
                    ? { uri: brandData.image }
                    : null
            );
        } else {
            setName('');
            setCategory('');
            setImage(null);
        }
    }, [brandData, mode, visible]);

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>

                <Text style={styles.title}>
                    {mode === "edit" ? "Edit Brand" : "Create Brand"}
                </Text>

                <Text style={styles.label}>Brand Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter brand name"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Category</Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setOpenCategory(!openCategory)}>
                    <Text style={!category && { color: '#999' }}>
                        {
                            categories.find(c => c.value === category)?.label ||
                            'Select Category'
                        }
                    </Text>
                </TouchableOpacity>

                {openCategory && (
                    <View style={styles.dropdownList}>
                        {categories.map(item => (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCategory(item.value);
                                    setOpenCategory(false);
                                }}>
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.upload}
                    onPress={pickImage}>
                    <Text>Select Image</Text>
                </TouchableOpacity>

                {image && (
                    <Image
                        source={{ uri: image.uri }}
                        style={styles.preview}
                    />
                )}

                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: '#ccc' }]}
                        onPress={onClose}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handleSubmit}>
                        <Text style={{ color: '#fff' }}>
                            {mode === "edit" ? "Update" : "Create"}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

export default AddBrandModal;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        marginTop: 10,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginTop: 6,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    upload: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
    },
    preview: {
        width: 80,
        height: 80,
        marginTop: 10,
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 10,
    },
    btn: {
        flex: 1,
        backgroundColor: '#4F7F1F',
        padding: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
});