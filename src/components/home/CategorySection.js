import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


const CategorySection = ({ data = [], navigation, role }) => {


  return (
    <View style={{ marginTop: 25 }}>

      <View style={styles.row}>
        <Text style={styles.title}>Categories</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Category')}>
          <Text style={{ color: 'green' }}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>

        {(data.length ? data : []).map((item, index) => (
          <TouchableOpacity
            key={item._id || index}
            style={styles.card}
            activeOpacity={role === 'B2C' ? 0.5 : 1}
            onPress={() => role === 'B2C' ? navigation.navigate("UserProduct", { categoryId: item._id, categoryName: item.name, categoryImage: item.image }) : null }
          >

            {/* 🔥 IMAGE (DYNAMIC) */}
            <Image
              source={
                item?.image
                  ? { uri: item.image }
                  : require('../../assets/images/cat.png') // fallback
              }
              style={styles.img}
            />

            <View style={{
              flexDirection: 'row',
              padding: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}>

              {/* 🔥 NAME */}
              <Text style={styles.name}>
                {item?.name || "Category"}
              </Text>

              <View style={{
                backgroundColor: '#FAF3E7',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                alignSelf: 'center',
              }}>

                {/* 🔥 COUNT */}
                {role !== 'B2C' ? (
                  <Text style={styles.count}>
                    {`${item?.totalBrands}+`}
                  </Text>
                ) : <Text style={styles.count}>
                    {`${item?.totalProducts}+`}
                  </Text>}

              </View>
            </View>

            {role !== 'B2C' &&
              <View style={[styles.cardFooter, { gap: 5 }]}>

                <TouchableOpacity
                  style={styles.sell}
                  onPress={() => navigation.navigate('AddProductDetailsScreen')}
                >
                  <Text style={styles.sellText}>Sell</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buy}
                  onPress={() => navigation.navigate("BrandScreen", { categoryId: item._id })
                  }
                >
                  <Text style={styles.buyText}>Buy</Text>
                </TouchableOpacity>

              </View>}
          </TouchableOpacity>
        ))}





         <TouchableOpacity
            // key={item._id || index}
            style={styles.card}
            activeOpacity={0.5}
            onPress={() =>  navigation.navigate("SelectLocationScreen") }
          >

            {/* 🔥 IMAGE (DYNAMIC) */}
            <Image
              source={ require('../../assets/images/mandi.png')}
              style={styles.img}
            />

            <View style={{
              flexDirection: 'row',
              padding: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}>

              {/* 🔥 NAME */}
              <Text style={[styles.name, {textAlign:'center', width:'100%', fontSize:16}]}>
                {"Mandi Bhav"}
              </Text>

             
            </View>

           
          </TouchableOpacity>

      </View>
    </View>
  );
};

export default CategorySection;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12
  },
  img: { width: '100%', height: 107, borderRadius: 12 },
  name: { fontWeight: 'bold', marginTop: 8, width: '70%' },
  count: { color: 'orange', marginTop: 4 },
  sell: {
    borderWidth: 1,
    borderColor: '#4C7A1E',
    backgroundColor: '#4C7A1E',
    width: '50%',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  sellText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',

  },
  buy: {
    borderWidth: 1,
    borderColor: '#4C7A1E',
    backgroundColor: '#EDF2E9',
    width: '50%',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  buyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4C7A1E',

  },
  cardFooter: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
