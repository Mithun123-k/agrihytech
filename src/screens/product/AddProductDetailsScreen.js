
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductHeader from '../../components/product/ProductHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import AddBrandModal from '../brands/AddBrandModal';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandsByCategory, getCategoriesByRole } from '../../features/category/categorySlice';
import { createProduct, updateProduct } from '../../features/product/productSlice';
import { createBrand } from '../../features/brands/brandSlice';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const COLORS = {
    background: '#EEF1EB',
    white: '#FFFFFF',
    border: '#E4E4E4',
    green: '#4F7F1F',
    lightGreen: '#EEF5E5',
    text: '#1E1E1E',
    grey: '#8A8A8A',
    error: '#E53935',
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    brand: Yup.mixed().required('Company / Brand name is required'),
    category: Yup.string().required('Category is required'),
    // subCategory: Yup.string().required('Sub category is required'),
    description: Yup.string()
        .required('Description is required')
        .max(500, 'Maximum 500 characters'),
    price: Yup.string().required('Price is required'),
    quantity: Yup.string().required('Quantity is required'),
    unit: Yup.string().required('Unit is required'),
});

const Input = ({ error, multiline, ...props }) => (
    <>
        <TextInput
            placeholderTextColor="#9C9C9C"
            multiline={multiline}
            style={[
                styles.input,
                multiline && styles.multilineInput,
                error && styles.errorBorder,
            ]}
            {...props}
        />
        {!!error && <Text style={styles.errorText}>{error}</Text>}
    </>
);

const Label = ({ title, required }) => (
    <Text style={styles.label}>
        {title}
        {required && <Text style={{ color: COLORS.error }}> *</Text>}
    </Text>
);

const Card = ({ title, children }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
    </View>
);

const Dropdown = ({
    label,
    value,
    onChange,
    items,
    placeholder,
    error,
    required,
    disabled,
    multiple = false,
}) => {
    const [open, setOpen] = React.useState(false);

    const displayValue = multiple
        ? value?.length
            ? items
                .filter(item => value.includes(item.value))
                .map(i => i.label)
                .join(', ')
            : placeholder
        : items.find(item => item.value === value)?.label || placeholder;

    return (
        <View style={{ zIndex: open ? 1000 : 1 }}>
            <Label title={label} required={required} />

            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.dropdownContainer,
                    error && styles.errorBorder,
                    disabled && { opacity: 0.5 },
                ]}
                onPress={() => setOpen(!open)}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.dropdownText,
                        !value?.length && !value && { color: '#9C9C9C' },
                    ]}
                >
                    {displayValue}
                </Text>

                <Icon
                    name={open ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={18}
                    color="#666"
                />
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownList}>
                    {items.map(item => {
                        const isSelected = multiple
                            ? value?.includes(item.value)
                            : value === item.value;

                        return (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    if (multiple) {
                                        const exists = value.includes(item.value);

                                        const updated = exists
                                            ? value.filter(v => v !== item.value)
                                            : [...value, item.value];

                                        onChange(updated);
                                    } else {
                                        onChange(item.value);
                                        setOpen(false);
                                    }
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {item.label} {isSelected ? '✓' : ''}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const CATEGORY_OPTIONS = [
    { label: 'Seeds', value: 'Seeds' },
    { label: 'Fertilizers', value: 'Fertilizers' },
    { label: 'Pesticides', value: 'Pesticides' },
    { label: 'Equipment', value: 'Equipment' },
];

// ADD THIS near CATEGORY_OPTIONS
const BRAND_OPTIONS = [
    { label: 'CropGuard', value: 'CropGuard' },
    { label: 'AgriTech', value: 'AgriTech' },
    { label: 'Kisan Power', value: 'Kisan Power' },
    { label: '+ Add New Brand', value: '__add_new__' },
];

const SUBCATEGORY_OPTIONS = {
    Seeds: [
        { label: 'Wheat Seeds', value: 'Wheat Seeds' },
        { label: 'Rice Seeds', value: 'Rice Seeds' },
        { label: 'Vegetable Seeds', value: 'Vegetable Seeds' },
    ],
    Fertilizers: [
        { label: 'Organic', value: 'Organic' },
        { label: 'Chemical', value: 'Chemical' },
        { label: 'Bio Fertilizer', value: 'Bio Fertilizer' },
    ],
    Pesticides: [
        { label: 'Insecticide', value: 'Insecticide' },
        { label: 'Fungicide', value: 'Fungicide' },
        { label: 'Herbicide', value: 'Herbicide' },
    ],
    Equipment: [
        { label: 'Sprayer', value: 'Sprayer' },
        { label: 'Tractor Tools', value: 'Tractor Tools' },
        { label: 'Irrigation', value: 'Irrigation' },
    ],
};

const AddProductDetailsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const product = route?.params?.product;
    const isEdit = !!product;
    const { categories, brands } = useSelector(
        (state) => state.category
    );
    const { user } = useSelector(state => state.auth);

    console.log("User from Add product => ", user?.role)

    const { loading } = useSelector(state => state.product);

    const [images, setImages] = useState([]);
    const [brandModal, setBrandModal] = useState(false);
    const [brandData, setBrandData] = useState(brands); // 🔥 add this
    const [newBrand, setNewBrand] = useState({
        name: '',
        category: '',
        image: null,
    });


    console.log("Categories from Redux => ", categories);
    console.log("Brands from Redux => ", brands);

    // 🔥 API CALL
    useEffect(() => {
        dispatch(getCategoriesByRole());
    }, []);

    const pickBrandImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.7,
        });

        if (!result.didCancel && result.assets?.length > 0) {
            setNewBrand({ ...newBrand, image: result.assets[0] });
        }
    };

    const handleCreateBrand = async (brand, setFieldValue) => {
        try {
            const formData = new FormData();

            formData.append("name", brand.name);
            formData.append("category", brand.category);

            if (brand.image?.uri) {
                formData.append("image", {
                    uri: brand.image.uri,
                    type: brand.image.type || "image/jpeg",
                    name: brand.image.fileName || "brand.jpg",
                });
            }

            const response = await dispatch(
                createBrand(brand)
            ).unwrap();

            console.log("Created Brand => ", response);

            // Redux refresh
            dispatch(
                getBrandsByCategory({
                    categoryId: brand.category,
                })
            );

            // Auto select new brand
            setFieldValue("brand", response?._id);

            setBrandModal(false);

            alert("Brand created successfully");

        } catch (error) {
            console.log("Create Brand Error => ", error);

            alert(
                error?.message || "Failed to create brand"
            );
        }
    };

    const handlePickImages = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 5,
            quality: 0.8,
        });

        if (!result.didCancel && result.assets) {
            setImages(result.assets);
        }
    };

    const removeImage = index => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    console.log('product image', images)

    useEffect(() => {
        if (product?.images) {
            setImages(product.images);
        }
    }, [product]);


    return (
        <Formik
            // initialValues={{
            //     name: '',
            //     brand: '',
            //     category: '',
            //     // subCategory: '',
            //     description: '',
            //     price: '',
            //     quantity: '',
            //     unit: '',
            //     brandVariety: '',
            //     qualityGrade: '',
            //     keyBenefit: '',
            //     keyBenefits: [],
            //     crop: '',
            //     suitableCrops: [],
            //     activeIngredient: '',
            //     targetPests: '',
            //     safetyPeriod: '',
            //     packSize: '',
            //     storage: '',
            //     safetyPrecautions: '',
            //     usageSteps: [
            //         { heading: '', description: '' },
            //         { heading: '', description: '' },
            //     ],



            // }}
            // // validationSchema={validationSchema}


            initialValues={{
                name: product?.name || '',
                brand:
                    user?.role === 'ADMIN'
                        ? product?.brand || []
                        : product?.brand?.[0] || '',
                category: product?.category || '',
                description: product?.description || '',
                price: product?.price?.toString() || '',
                quantity: product?.quantity?.toString() || '',
                unit: product?.unit || '',
                brandVariety: product?.brandVariety || '',
                qualityGrade: product?.qualityGrade || '',
                keyBenefit: '',
                keyBenefits: product?.keyBenefits || [],
                crop: '',
                suitableCrops: product?.suitableCrops || [],
                activeIngredient: product?.specifications?.activeIngredient || '',
                targetPests: product?.specifications?.targetPests || '',
                safetyPeriod: product?.specifications?.safetyPeriod || '',
                packSize: product?.specifications?.packSize || '',
                storage: product?.specifications?.storage || '',
                safetyPrecautions: product?.safetyPrecautions || '',
                usageSteps: product?.usageSteps?.length
                    ? product.usageSteps
                    : [
                        { heading: '', description: '' },
                        { heading: '', description: '' },
                    ],
            }}
            enableReinitialize
            validationSchema={validationSchema}

            onSubmit={async values => {
                const formData = new FormData();

                // Basic fields
                formData.append('name', values.name);
                // formData.append('brand', values.brand);
                formData.append('category', values.category);
                formData.append('description', values.description);
                formData.append('price', values.price);
                formData.append('quantity', values.quantity);
                formData.append('unit', values.unit);
                formData.append('brandVariety', values.brandVariety);
                formData.append('qualityGrade', values.qualityGrade);
                formData.append('safetyPrecautions', values.safetyPrecautions);

                if (Array.isArray(values.brand)) {
                    values.brand.forEach(brandId => {
                        formData.append('brand[]', brandId);
                    });
                } else {
                    formData.append('brand', values.brand);
                }

                // // Arrays
                // formData.append(
                //     'keyBenefits',
                //     JSON.stringify(values.keyBenefits.filter(item => item.trim()))
                // );

                // formData.append(
                //     'suitableCrops',
                //     JSON.stringify(values.suitableCrops.filter(item => item.trim()))
                // );

                values.keyBenefits.forEach(item => {
                    formData.append('keyBenefits[]', item);
                });

                values.suitableCrops.forEach(item => {
                    formData.append('suitableCrops[]', item);
                });

                values.usageSteps
                    .filter(item => item.heading.trim() || item.description.trim())
                    .forEach((step, index) => {
                        formData.append(`usageSteps[${index}][heading]`, step.heading);
                        formData.append(`usageSteps[${index}][description]`, step.description);
                    });

                // Specifications
                formData.append('specifications[activeIngredient]', values.activeIngredient);
                formData.append('specifications[targetPests]', values.targetPests);
                formData.append('specifications[safetyPeriod]', values.safetyPeriod);
                formData.append('specifications[packSize]', values.packSize);
                formData.append('specifications[storage]', values.storage);

                // Images
                // images.forEach((image, index) => {
                //     formData.append('images', {
                //         uri: image.uri,
                //         type: image.type || 'image/jpeg',
                //         name: image.fileName || `image_${index}.jpg`,
                //     });
                // });

                images.forEach((image, index) => {
                    if (image.uri && !image.url) {
                        formData.append('images', {
                            uri: image.uri,
                            type: image.type || 'image/jpeg',
                            name: image.fileName || `image_${index}.jpg`,
                        });
                    }
                });

                try {
                    if (isEdit) {
                        await dispatch(
                            updateProduct({
                                id: product._id,
                                productData: formData

                            })
                        ).unwrap();

                        alert('Product updated successfully');
                    } else {
                        await dispatch(createProduct(formData)).unwrap();
                        alert('Product created successfully');
                    }
                    navigation.goBack();
                } catch (error) {
                    console.log(error);
                    alert(error?.message || 'Failed to create product');
                }
            }}

        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
            }) => (
                <View style={styles.container}>
                    <ProductHeader
                        navigation={navigation}
                        // title="Add Product Details"
                        title={isEdit ? "Update Product" : "Add Product Details"}
                        showShare={false}
                        onShare={() => console.log("share clicked")}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.content}>
                        <Text style={styles.title}>{isEdit ? 'Update Product' : 'Add New Product'}</Text>
                        <Text style={styles.subtitle}>
                            Fill in product details to list it for farmers
                        </Text>

                        <Card title="Product Photos">
                            <TouchableOpacity
                                style={styles.uploadBox}
                                activeOpacity={0.8}
                                onPress={handlePickImages}>
                                <View style={styles.uploadIcon}>
                                    <Icon name="image-outline" size={22} color={COLORS.green} />
                                </View>

                                <Text style={styles.uploadTitle}>Add Product Images</Text>
                                <Text style={styles.uploadSub}>Tap to upload up to 5 images</Text>
                            </TouchableOpacity>

                            {images.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.imageList}>
                                    {images.map((item, index) => (
                                        <View key={index} style={styles.imageWrapper}>
                                            {/* <Image source={{ uri: item.uri }} style={styles.previewImage} /> */}
                                            <Image
                                                source={{ uri: item.uri || item.url }}
                                                style={styles.previewImage}
                                            />
                                            <TouchableOpacity
                                                style={styles.removeBtn}
                                                onPress={() => removeImage(index)}>
                                                <Icon name="close" size={14} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </Card>

                        <Card title="Product Information">
                            <Label title="Product Name" required />
                            <Input
                                placeholder="eg. CropGuard Pro Insecticide"
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                error={touched.name && errors.name}
                            />



                            <View style={styles.row}>
                                <View style={styles.half}>
                                    <Dropdown
                                        label="Category"
                                        required
                                        value={values.category}
                                        placeholder="Select Category"
                                        items={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                                        onChange={itemValue => {
                                            console.log("Selected Category ID => ", itemValue);
                                            setFieldValue('category', itemValue);
                                            // setFieldValue('subCategory', '');
                                            dispatch(getBrandsByCategory({ categoryId: itemValue , isAdmin: user?.role === 'ADMIN' }));
                                        }}
                                        error={touched.category && errors.category}
                                    />
                                </View>

                                {/* <View style={styles.half}>
                                    <Dropdown
                                        label="Sub Category"
                                        required
                                        value={values.subCategory}
                                        placeholder="Select Sub Category"
                                        items={SUBCATEGORY_OPTIONS[values.category] || []}
                                        onChange={itemValue =>
                                            setFieldValue('subCategory', itemValue)
                                        }
                                        error={touched.subCategory && errors.subCategory}
                                    />
                                </View> */}
                            </View>


                            <Dropdown
                                label="Company/Brand Name"
                                required
                                value={values.brand}
                                placeholder="Select Brand"
                                disabled={!values.category}
                                multiple={user?.role === 'ADMIN'}
                                items={[
                                    ...brands.map(brand => ({
                                        label: brand.name,
                                        value: brand._id,
                                    })),
                                    { label: '+ Add New Brand', value: '__add_new__' },
                                ]}
                                onChange={itemValue => {
                                    if (
                                        itemValue === '__add_new__' ||
                                        itemValue?.includes?.('__add_new__')
                                    ) {
                                        setBrandModal(true);
                                        return;
                                    }

                                    setFieldValue('brand', itemValue);
                                }}
                                error={touched.brand && errors.brand}
                            />
                        </Card>

                        <Card title="Description">
                            <Input
                                multiline
                                placeholder="Describe your product, quality..."
                                value={values.description}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                error={touched.description && errors.description}
                            />
                            <Text style={styles.counter}>
                                {values.description.length}/500 characters
                            </Text>
                        </Card>

                        <Card title="Pricing Details">
                            <View style={styles.priceContainer}>
                                <Text style={styles.rupee}>₹</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="Enter Price"
                                    placeholderTextColor="#9C9C9C"
                                    keyboardType="numeric"
                                    value={values.price}
                                    onChangeText={handleChange('price')}
                                />
                            </View>
                            {!!errors.price && touched.price && (
                                <Text style={styles.errorText}>{errors.price}</Text>
                            )}
                        </Card>

                        <Card title="Product Details">
                            <View style={styles.row}>
                                <View style={styles.half}>
                                    <Label title="Quantity" required />
                                    <Input
                                        placeholder="120"
                                        value={values.quantity}
                                        onChangeText={handleChange('quantity')}
                                        error={touched.quantity && errors.quantity}
                                    />
                                </View>

                                <View style={styles.half}>
                                    <Label title="Unit" required />
                                    <Input
                                        placeholder="Select"
                                        value={values.unit}
                                        onChangeText={handleChange('unit')}
                                        error={touched.unit && errors.unit}
                                    />
                                </View>
                            </View>

                            {user?.role !== 'B2B' && <View style={[styles.row, { marginTop: 8 }]}>
                                <View style={styles.half}>
                                    <Label title="Brand / Variety" />
                                    <Input
                                        placeholder="120"
                                        value={values.brandVariety}
                                        onChangeText={handleChange('brandVariety')}
                                    />
                                </View>

                                <View style={styles.half}>
                                    <Label title="Quality / Grade" />
                                    <Input
                                        placeholder="Select"
                                        value={values.qualityGrade}
                                        onChangeText={handleChange('qualityGrade')}
                                    />
                                </View>
                            </View>}
                        </Card>
                        {user?.role !== 'B2B' && (
                            <>
                                <Card title="Usage & Dosage">
                                    <FieldArray
                                        name="usageSteps"
                                        render={arrayHelpers => (
                                            <>
                                                {values.usageSteps.map((item, index) => (
                                                    <View key={index} style={{ marginBottom: 14 }}>
                                                        <Text style={styles.stepTitle}>Step {index + 1}</Text>
                                                        <Input
                                                            placeholder="Heading"
                                                            value={item.heading}
                                                            onChangeText={text =>
                                                                setFieldValue(
                                                                    `usageSteps[${index}].heading`,
                                                                    text,
                                                                )
                                                            }
                                                        />
                                                        <Input
                                                            multiline
                                                            placeholder="explain how it works"
                                                            value={item.description}
                                                            onChangeText={text =>
                                                                setFieldValue(
                                                                    `usageSteps[${index}].description`,
                                                                    text,
                                                                )
                                                            }
                                                        />
                                                    </View>
                                                ))}

                                                <TouchableOpacity
                                                    style={styles.smallButton}
                                                    onPress={() =>
                                                        arrayHelpers.push({ heading: '', description: '' })
                                                    }>
                                                    <Text style={styles.smallButtonText}>Add Step</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    />
                                </Card>

                                <Card title="Key Benefits">
                                    <View style={styles.tagInputRow}>
                                        <TextInput
                                            style={styles.tagInput}
                                            placeholder="eg. CropGuard Pro Insecticide"
                                            placeholderTextColor="#9C9C9C"
                                            value={values.keyBenefit}
                                            onChangeText={handleChange('keyBenefit')}
                                        />
                                        <TouchableOpacity
                                            style={styles.circleBtn}
                                            onPress={() => {
                                                if (values.keyBenefit.trim()) {
                                                    setFieldValue('keyBenefits', [
                                                        ...values.keyBenefits,
                                                        values.keyBenefit,
                                                    ]);
                                                    setFieldValue('keyBenefit', '');
                                                }
                                            }}>
                                            <Icon name="add" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.tagsWrap}>
                                        {values.keyBenefits.map((item, index) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{item}</Text>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setFieldValue(
                                                            'keyBenefits',
                                                            values.keyBenefits.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                >
                                                    <Icon name="close" size={14} color="#666" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </Card>

                                <Card title="Suitable for Crops *">
                                    <View style={styles.tagInputRow}>
                                        <TextInput
                                            style={styles.tagInput}
                                            placeholder="eg. wheat, Rice..."
                                            placeholderTextColor="#9C9C9C"
                                            value={values.crop}
                                            onChangeText={handleChange('crop')}
                                        />
                                        <TouchableOpacity
                                            style={styles.circleBtn}
                                            onPress={() => {
                                                if (values.crop.trim()) {
                                                    setFieldValue('suitableCrops', [
                                                        ...values.suitableCrops,
                                                        values.crop,
                                                    ]);
                                                    setFieldValue('crop', '');
                                                }
                                            }}>
                                            <Icon name="add" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.tagsWrap}>
                                        {values.suitableCrops.map((item, index) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{item}</Text>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setFieldValue(
                                                            'suitableCrops',
                                                            values.suitableCrops.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                >
                                                    <Icon name="close" size={14} color="#666" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </Card>

                                <Card title="Specifications">
                                    <Label title="Active Ingredient" />
                                    <Input
                                        placeholder="eg. Imidacloprid 17.8% SL"
                                        value={values.activeIngredient}
                                        onChangeText={handleChange('activeIngredient')}
                                    />

                                    <Label title="Target Pests" />
                                    <Input
                                        placeholder="eg. Aphids, Jassids"
                                        value={values.targetPests}
                                        onChangeText={handleChange('targetPests')}
                                    />

                                    <Label title="Safety Period" />
                                    <Input
                                        placeholder="eg. 7-10 days before harvest"
                                        value={values.safetyPeriod}
                                        onChangeText={handleChange('safetyPeriod')}
                                    />

                                    <Label title="Pack Size" />
                                    <Input
                                        placeholder="eg. 250ml, 500ml, 1L"
                                        value={values.packSize}
                                        onChangeText={handleChange('packSize')}
                                    />

                                    <Label title="Storage" />
                                    <Input
                                        placeholder="eg. Store in cool."
                                        value={values.storage}
                                        onChangeText={handleChange('storage')}
                                    />

                                    {/* <TouchableOpacity style={styles.fullButton}>
                                <Text style={styles.fullButtonText}>Add More Specifications</Text>
                            </TouchableOpacity> */}
                                </Card>

                                <Card title="Safety & Precautions">
                                    <Input
                                        multiline
                                        placeholder="Describe product Safety & Precautions"
                                        value={values.safetyPrecautions}
                                        onChangeText={handleChange('safetyPrecautions')}
                                    />
                                    <Text style={styles.counter}>
                                        {values.safetyPrecautions.length}/500 characters
                                    </Text>
                                </Card> </>)}

                        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                            <Text style={styles.saveButtonText}>{loading
                                ? (isEdit ? 'Updating...' : 'Saving...')
                                : (isEdit ? 'Update Product' : 'Save Product')}</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <AddBrandModal
                        visible={brandModal}
                        onClose={() => setBrandModal(false)}
                        categories={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                        onCreate={(brand) => handleCreateBrand(brand, setFieldValue)}
                    />
                </View>
            )}
        </Formik>
    );
};

export default AddProductDetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        paddingHorizontal: isTablet ? 28 : 14,
        paddingBottom: 40,
        maxWidth: 760,
        alignSelf: 'center',
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text },
    title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
    subtitle: { fontSize: 13, color: COLORS.grey, marginTop: 4, marginBottom: 18 },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
    },
    cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, color: COLORS.text },
    uploadBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C8D0C0',
        borderRadius: 14,
        alignItems: 'center',
        paddingVertical: 28,
        backgroundColor: '#F8FAF5',
    },
    uploadIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
    uploadSub: { fontSize: 12, color: COLORS.grey, marginTop: 3 },
    label: { fontSize: 12, color: '#555', marginBottom: 8, marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: COLORS.text,
        backgroundColor: '#fff',
        marginTop: 4,
    },
    multilineInput: { height: 95, textAlignVertical: 'top' },
    errorBorder: { borderColor: COLORS.error },
    errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
    row: { flexDirection: 'row', gap: 10 },
    half: { flex: 1 },
    counter: { fontSize: 11, color: COLORS.grey, marginTop: 6 },
    priceContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    rupee: { fontSize: 18, color: COLORS.text, marginRight: 8 },
    priceInput: { flex: 1, fontSize: 14, color: COLORS.text },
    stepTitle: { fontSize: 13, fontWeight: '500', marginBottom: 8 },
    smallButton: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.green,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    smallButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    tagInputRow: { flexDirection: 'row', alignItems: 'center' },
    tagInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
        color: COLORS.text,
    },
    circleBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.green,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
    tag: {
        backgroundColor: '#F2F2F2',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tagText: { fontSize: 12, color: '#666' },
    fullButton: {
        backgroundColor: COLORS.green,
        borderRadius: 10,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    fullButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    saveButton: {
        backgroundColor: COLORS.green,
        borderRadius: 12,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        backgroundColor: '#fff',
        minHeight: 48,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        flex: 1,
        color: COLORS.text,
        fontSize: 14,
    },
    dropdownList: {
        marginTop: 6,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownItemText: {
        color: COLORS.text,
        fontSize: 14,
    },
    imageList: {
        marginTop: 14,
        paddingRight: 10,
    },

    imageWrapper: {
        marginRight: 12,
        position: 'relative',
    },

    previewImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#F2F2F2',
    },

    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },

    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
});
