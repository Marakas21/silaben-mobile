import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Gap} from '../..';

const TransactionCard = ({date, items, price, isExpense}) => {
  const colorValue = isExpense => {
    if (isExpense) {
      return (color = '#D9435E');
    }
    return (color = '#1ABC9C');
  };
  return (
    <View style={[styles.trView, styles.elevation]}>
      <View style={styles.detail}>
        <Text style={styles.date}>{date}</Text>
        <Gap height={5} />
        <Text style={styles.spends}>{items}</Text>
      </View>
      <Text style={styles.money(colorValue(isExpense))}>{price}</Text>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  trView: {
    height: 80,
    paddingRight: 20,
    flexDirection: 'row',
    borderRadius: 10,
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },

  elevation: {
    elevation: 8,
    shadowColor: '#52006A',
  },

  detail: {
    justifyContent: 'center',
    marginLeft: 25,
  },

  spends: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 17,
    lineHeight: 21,
    color: '#020202',
  },

  money: isExpense => ({
    marginVertical: 24,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 21,
    color: isExpense,
  }),
});
